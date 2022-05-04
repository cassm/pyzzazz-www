import {useState, useEffect} from "react";
import {v4 as uuidv4} from 'uuid';

const Configuration = props => {
  const [fixtures, setFixtures] = useState([]);
  const [nodes, setNodes] = useState({});

  const updateFixtures = async () => {
    const res = await fetch('/resource/fixtures');
    const json = await res.json();
    setFixtures(['unassigned'].concat(extractFixtures(json)));
  }

  const updateNodes = async () => {
    const res = await fetch('/resource/nodes');
    setNodes(await res.json());
  }

  useEffect(() => {
    updateNodes();
    updateFixtures();
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

  const pingNode = async nodeId => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({value: "PING"}),
    };

    const response = await fetch(`/control/clients/${nodeId}`, requestOptions);
  }

  const generateNodeConfigLine = (node, value, fixtureOptions) => {
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
        <button
          id={`node-ping-${node}`}
          onClick={async e => {
            e.preventDefault();
            pingNode(node);
          }}
        >
          Ping
        </button>
      </div>
    )
  }

  const postNodeConfig = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nodes),
    };

    const response = await fetch('/resource/nodes', requestOptions);
  }

  const nodeConfig = [];
  const fixtureOptions = generateFixtureOptions();

  for (const [key, entry] of Object.entries(nodes)) {
    if (nodes.hasOwnProperty(key)) {
      nodeConfig.push(generateNodeConfigLine(key, entry, fixtureOptions));
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
      </form>
    </div>
  )
}

export default Configuration;
