import React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from "@mui/material/Typography";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
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
    return (<Button variant='contained' id={patternName} key={uuidv4()} onClick={handlePatternButton}>{patternName}</Button>);
  })

  const overlayButtons = overlays.map(overlayName => {
    return (<Button variant='contained' id={overlayName} key={uuidv4()} onClick={handleOverlayButton}>{overlayName}</Button>);
  })

  const paletteButtons = palettes.map(paletteName => {
    return (<Button variant='contained' id={paletteName} key={uuidv4()} onClick={handlePaletteButton}>{paletteName}</Button>);
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
    <Box sx={{width: '100%', height: '100%'}}>
      <Typography variant="h2">Control</Typography>
      {loading ?
        <Typography variant='h2'>Loading....</Typography> :
        <Box sx={{width: '100%', height: '100%'}}>
          <Typography variant='h2'>Patterns</Typography>
          <ButtonGroup variant='contained' aria-label='pattern selection button group'>
            {patternButtons}
          </ButtonGroup>
          <Typography variant='h2'>Overlays</Typography>
          <ButtonGroup variant='contained' aria-label='pattern selection button group'>
            {overlayButtons}
          </ButtonGroup>
          <Typography variant='h2'>Palettes</Typography>
          <ButtonGroup variant='contained' aria-label='pattern selection button group'>
            {paletteButtons}
          </ButtonGroup>
          <Typography variant='h2'>Sliders</Typography>
          <Stack spacing={2}>
            {sliderControls}
          </Stack>
        </Box>
      }
    </Box>
  )
}

export default Control;
