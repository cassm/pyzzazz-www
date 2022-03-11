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
import {Grid} from "@mui/material";

const ControlPanel = props => {
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

  const handleControlButton = (type, name) => async (e) => {
    e.preventDefault();
    await queueCmd("led_fix", type, name, 1);
  }

  const handleSliderChange = (name) => async (e, value) => {
    await queueCmd("master_settings", "slider", name, value);
  }

  const wrapControls = (controls) => {
    return (
      <Box
        bgcolor="primary.main"
        sx={{
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'column',
          mb: 3,
          p: 2,
          alignItems: 'center',
          borderRadius: '1rem'
        }}
      >
        {controls}
      </Box>
    )

  }

  const generateButtonGroup = (title, names, type) => {
    return (
      <Grid key={uuidv4()} my='1rem' direction='column' container={true} alignItems='center'>
        <Typography variant='h5' color='secondary' sx={{mb: 2}} key={uuidv4()}>{title}</Typography>
        <ButtonGroup
          my='1rem'
          color='secondary'
          sx={{
            borderRadius: 2,
            display: 'flex',
            flexBasis: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
          }}
          key={uuidv4()}
          aria-label={`${type} selection button group`}
        >
          {names.map(name =>
            <Button
              variant='text'
              sx={{
                borderRadius: '2rem'
              }}
              id={name}
              key={uuidv4()}
              onClick={handleControlButton(type, name)}>
              <Typography>{name.replace(/_/g, ' ')}</Typography>
            </Button>
          )}
        </ButtonGroup>
      </Grid>
    );
  }

  const generateSliderGroup = () => {
    const sliders = [];

    Object.entries(sliderValues).map((key, entry) => {
      const [name, value] = key;
      const label = name.replace(/_/g, ' ');
      sliders.push (<Grid key={uuidv4()} my='1rem' direction='column' container={true} alignItems='center'>
        <Typography color="secondary" key={uuidv4()}>
          {label}
        </Typography>
        <Slider
          key={uuidv4()}
          aria-label={label}
          defaultValue={value}
          onChange={handleSliderChange(name)}
          min={0}
          max={1024}
          color="secondary"
          sx={{
            width: '75%'
          }}
        />
      </Grid>);
    });
    return (
      <Grid
        direction='column'
        alignItems='stretch'
        width='100%'
        container={true}
      >
        {sliders}
      </Grid>
    );
  }


  return (
    <Box
      width='100%'
      height='100%'
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    }}>
      {loading ?
        <Typography variant='h4' color='primary'>Loading....</Typography> :
        <Box width='100%' className='wat'>
          {wrapControls(generateButtonGroup('Patterns', patternNames, 'pattern'))}
          {wrapControls(generateButtonGroup('Overlays', overlayNames, 'overlay'))}
          {wrapControls(generateButtonGroup('Palettes', paletteNames, 'palette'))}
          {wrapControls(generateSliderGroup())}
        </Box>
      }
    </Box>
  )
}

export default ControlPanel;
