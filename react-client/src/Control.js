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
  const [patternNames, setPatternNames] = useState([]);
  const [overlayNames, setOverlayNames] = useState([]);
  const [sliderValues, setSliderValues] = useState({});
  const [paletteNames, setPaletteNames] = useState([]);

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

  useEffect(async () => {
    const fetchControls = async () => {
      updateSliders(await fetchResource('sliders'));
      setPatternNames(await fetchResource('patterns'))
      setOverlayNames(await fetchResource('overlays'))
      setPaletteNames(await fetchResource('palettes'))
    }
    await fetchControls();
    setLoading(false);
  }, []);

  const updateSliders = (sliderVals) => {
    for (const key in sliderVals) {
      if (sliderVals.hasOwnProperty(key)) {
        sliderVals[key] = Math.floor(sliderVals[key] * 1024)
      }
    }

    setSliderValues(sliderVals);
  }

  const handleControlButton = (type) => async (e) => {
    e.preventDefault();
    await queueCmd("led_fix", type, e.target.id, 1);
  }

  const handleSliderChange = (name) => async (e, value) => {
    await queueCmd("master_settings", "slider", name, value);
  }

  const generateButtonGroup = (names, type) => {
    return (
      <ButtonGroup variant='contained' aria-label={`${type} selection button group`}>
        {names.map(name =>
          <Button variant='contained' id={name} key={uuidv4()} onClick={handleControlButton(type)}>
            {name.replace(/_/g, ' ')}
          </Button>
        )}
      </ButtonGroup>
    );
  }

  const generateSliderGroup = () => {
    const sliders = [];

    Object.entries(sliderValues).map((key, entry) => {
      const [name, value] = key;
      const label = name.replace(/_/g, ' ');
      sliders.push (<Box sx={{width: '50%'}} key={uuidv4()}>
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
      </Box>);
    });
    return (
      <Stack spacing={2}>
        {sliders}
      </Stack>
    );
  }


  return (
    <Box sx={{width: '100%', height: '100%'}}>
      <Typography variant="h3">Control</Typography>
      {loading ?
        <Typography variant='h4'>Loading....</Typography> :
        <Box sx={{width: '100%', height: '100%'}}>
          <Typography variant='h4'>Patterns</Typography>
          {generateButtonGroup(patternNames, 'pattern')}
          <Typography variant='h4'>Overlays</Typography>
          {generateButtonGroup(overlayNames, 'overlay')}
          <Typography variant='h4'>Palettes</Typography>
          {generateButtonGroup(paletteNames, 'palette')}
          <Typography variant='h4'>Sliders</Typography>
          {generateSliderGroup()}
        </Box>
      }
    </Box>
  )
}

export default Control;
