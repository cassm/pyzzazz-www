import React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';
import useInterval from 'use-interval';
import {v4 as uuidv4} from 'uuid';
import {io} from "socket.io-client";

const Control = props => {
  const [loading, setLoading] = useState(true);
  const [patterns, setPatterns] = useState([]);
  const [overlays, setOverlays] = useState([]);
  const [sliders, setSliders] = useState({});
  const [palettes, setPalettes] = useState([]);
  const [socket, setSocket] = useState();

  useEffect(() => {
    setSocket(io.connect('/control'));
  }, [])

  const cmdQueue = [];

  const queueCmd = async (target_keyword, type, name, value) => {
    cmdQueue.push({
      target_keyword,
      command: {
        type,
        name,
        args: {},
      },
      value
    });
  };

  useInterval(async () => {
    if (cmdQueue.length > 0) {
      await socket.emit('control', cmdQueue);
      cmdQueue.splice(0,cmdQueue.length);
    }
  }, 1000/30);

  async function fetchResource(resource) {
    const res = await fetch(`/resource/${resource}`);
    return await res.json();
  }

  useEffect(() => {
    const fetchControls = async () => {
      setPatterns(await fetchResource('patterns'))
      setOverlays(await fetchResource('overlays'))
      setPalettes(await fetchResource('palettes'))
      updateSliders(await fetchResource('sliders'));
    }

    fetchControls();
    setLoading(false);
  }, [])

  const updateSliders = (sliderVals) => {
    for (const key in sliderVals) {
      if (sliderVals.hasOwnProperty(key)) {
        sliderVals[key] = Math.floor(sliderVals[key] * 1024)
      }
    }

    setSliders(sliderVals);
  }

  async function handlePatternButton(e) {
    e.preventDefault();
    queueCmd("led_fix", "pattern", e.target.id, 1);
  }

  async function handleOverlayButton(e) {
    e.preventDefault();
    queueCmd("led_fix", "overlay", e.target.id, 1);
  }

  async function handlePaletteButton(e) {
    e.preventDefault();
    queueCmd("led_fix", "palette", e.target.id, 1);
  }

  const handleSliderChange = (name) => async (e, value) => {
    await queueCmd("master_settings", "slider", name, value);
  }

  const patternButtons = patterns.map(patternName => {
    return (<button id={patternName} key={uuidv4()} onClick={handlePatternButton}>{patternName}</button>);
  })

  const overlayButtons = overlays.map(overlayName => {
    return (<button id={overlayName} key={uuidv4()} onClick={handleOverlayButton}>{overlayName}</button>);
  })

  const paletteButtons = palettes.map(paletteName => {
    return (<button id={paletteName} key={uuidv4()} onClick={handlePaletteButton}>{paletteName}</button>);
  })

  const sliderControls = Object.entries(sliders).map((key, entry) => {
    const [name, value] = key;
    const label = name.replace(/_/g, ' ');
    return (
      <Box sx={{width: '50%'}} key={uuidv4()}>
        <Typography key={uuidv4()}>
          {label}
        </Typography>
        <Slider
          key={uuidv4()}
          aria-label={label}
          defaultValue={value}
          onChange={handleSliderChange(name)}
          min={0}
          max={1024}
        />
      </Box>
    )
  })

  return (
    <div>
      <h1>Control</h1>
      {loading ?
        <h2>Loading....</h2> :
        <form>
          <h2>Patterns</h2>
          {patternButtons}
          <h2>Overlays</h2>
          {overlayButtons}
          <h2>Palettes</h2>
          {paletteButtons}
          <h2>Sliders</h2>
          <Stack spacing={2}>
            {sliderControls}
          </Stack>
        </form>
      }
    </div>
  )
}

export default Control;
