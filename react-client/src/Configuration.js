import {useState, useEffect} from "react";
import {v4 as uuidv4} from 'uuid';
import './Configuration.css';

const Configuration = props => {
  const [fixtures, setFixtures] = useState([]);
  const [nodes, setNodes] = useState({});
  const [colourModes, setColourModes] = useState({});

  const updateFixtures = async () => {
    const res = await fetch('/resource/fixtures');
    const json = await res.json();
    setFixtures(['unassigned'].concat(extractFixtures(json)));
  }

  const updateNodes = async () => {
    const res = await fetch('/resource/nodes');
    setNodes(await res.json());
  }

  const updateColourModes = async () => {
    const res = await fetch('/resource/colourModes');
    setColourModes(await res.json());
  }

  const sendServerCmd = async(target_keyword, type, value) => {
    const cmd = [{
      target_keyword,
      command: {
        type,
        name: "",
        args: {},
      },
      value
    }];

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cmd)
    };

    const response = await fetch('/control/', requestOptions);
  }

  useEffect(() => {
    updateNodes();
    updateFixtures();
    updateColourModes();
  }, []);

  const generateFixtureOptions = () => {
    const fixtureOptions = [];

    for (const fixture of fixtures) {
      fixtureOptions.push(
        <option value={fixture} key={uuidv4()}>{fixture}</option>
      )
    }

    return fixtureOptions;
  }

  const extractFixtures = obj => {
    let fixtureList = []

    for (const [key, entry] of Object.entries(obj)) {
      if (key === 'instances') {
        fixtureList = fixtureList.concat(entry);
      }
      else if (obj.hasOwnProperty(key) && entry != null && typeof entry === 'object') {
        fixtureList = fixtureList.concat(extractFixtures(entry));
      }
    }

    return fixtureList;
  }

  const sendNodeCmd = async (nodeId, cmd) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({value: cmd}),
    };

    const response = await fetch(`/control/clients/${nodeId}`, requestOptions);
  }

  const generateNodeConfigLine = (node, value, colourMode, fixtureOptions) => {
    if (!fixtures.includes(value)) {
      value = "unassigned";
    }

    return (
      <div className='config-line' key={uuidv4()}>
        <label>
          {node}
          <select
            name={`fixture-select-${node}`}
            id={`fixture-select-${node}`}
            value={value}
            onChange={e => setNodes({...nodes, [node]: e.target.value})}
          >
            {fixtureOptions}
          </select>
        </label>
        <label>
          Colour mode
          <select
            name={`colour-mode-{node}`}
            id={`colour-mode-{node}`}
            value={colourMode}
            onChange={e => setColourModes({...colourModes, [node]: e.target.value})}
          >
            <option value="COLOUR_MODE_RGB" key={uuidv4()}>RGB</option>
            <option value="COLOUR_MODE_RGBW" key={uuidv4()}>RGBW</option>

          </select>

        </label>
        <label>

        </label>
        <button
          id={`node-ping-${node}`}
          onClick={async e => {
            e.preventDefault();
            sendNodeCmd(node, "PING");
          }}
        >
          Ping
        </button>
        <button
          id={`node-reset-${node}`}
          onClick={async e => {
            e.preventDefault();
            sendNodeCmd(node, "RESET");
          }}
        >
          Reset
        </button>
        <button
          id={`node-calibrate-minus-${node}`}
          onClick={async e => {
            e.preventDefault();
            sendServerCmd(value, "calibration", -3.14/6);
          }}
        >
          Calibrate -
        </button>
        <button
          id={`node-calibrate-plus-${node}`}
          onClick={async e => {
            e.preventDefault();
            sendServerCmd(value, "calibration", 3.14/6);
          }}
        >
          Calibrate +
        </button>
      </div>
    )
  }

  const postNodeConfig = async () => {
    let requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nodes),
    };

    let response = await fetch('/resource/nodes', requestOptions);

    requestOptions.body = JSON.stringify(colourModes);
    response = await fetch('/resource/colourModes', requestOptions);

    for (const [key, entry] of Object.entries(colourModes)) {
      if (colourModes.hasOwnProperty(key)) {
        sendNodeCmd(key, entry);
      }
    }
  }

  const nodeConfig = [];
  const fixtureOptions = generateFixtureOptions();

  for (const [key, entry] of Object.entries(nodes)) {
    if (nodes.hasOwnProperty(key)) {
      nodeConfig.push(generateNodeConfigLine(key, entry, colourModes[key] || "COLOUR_MODE_RGB", fixtureOptions));
    }
  }

  return (
    <div>
      <h1>Configuration</h1>
      <h2>Nodes</h2>
      <form className='nodeConfig'>
        {nodeConfig}
        <button
          id='refresh-button'
          onClick={async e => {
            e.preventDefault();
            await updateNodes();
            await updateFixtures();
            await updateColourModes();
          }}
        >
          Refresh
        </button>
        <button
          id='submit-button'
          onClick={async e => {
            e.preventDefault();
            await postNodeConfig();
          }}
        >
          Submit
        </button>
        <button
          id="toggle-calibration"
          onClick={async e => {
            e.preventDefault();
            sendServerCmd("", "toggle_calibration", 0);
          }}
        >
          Toggle calibration mode
        </button>
      </form>
    </div>
  )
}

export default Configuration;
