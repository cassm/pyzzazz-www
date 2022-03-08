import React from 'react';
import {useEffect, useState} from 'react';
import {v4 as uuidv4} from 'uuid';

const Control = props => {
  const [loading, setLoading] = useState(true);
  const [patterns, setPatterns] = useState([]);
  const [overlays, setOverlays] = useState([]);
  const [sliders, setSliders] = useState({});
  const [palettes, setPalettes] = useState([]);

  async function fetchResource (resource) {
    const res = await fetch(`/resource/${resource}`);
    return await res.json();
  }

  useEffect(() => {
    const fetchControls = async() => {
      setPatterns(await fetchResource('patterns'))
      setOverlays(await fetchResource('overlays'))
      setPalettes(await fetchResource('palettes'))
      updateSliders( await fetchResource('sliders'));
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

  const sendCmd = async (target_keyword, type, name, value) => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        target_keyword,
        command: {
          type,
          name,
          args: {},
        },
        value
      })
    }
    await fetch('/control', requestOptions);
  }

  async function handlePatternButton(e) {
    e.preventDefault();
    await sendCmd("led_fix", "pattern", e.target.id, 1);
  }

  async function handleOverlayButton(e) {
    e.preventDefault();
    await sendCmd("led_fix", "overlay", e.target.id, 1);
  }

  async function handlePaletteButton(e) {
    e.preventDefault();
    await sendCmd("led_fix", "palette", e.target.id, 1);
  }

  async function handleSliderChange(e) {
    e.target.innerHTML = e.target.value;
    await sendCmd("master_settings", "slider", e.target.id, e.target.value);
  }

  const patternButtons = patterns.map(patternName => {
    return(<button id={patternName} key={uuidv4()} onClick={handlePatternButton}>{patternName}</button>);
  })

  const overlayButtons = overlays.map(overlayName => {
    return(<button id={overlayName} key={uuidv4()} onClick={handleOverlayButton}>{overlayName}</button>);
  })

  const paletteButtons = palettes.map(paletteName => {
    return(<button id={paletteName} key={uuidv4()} onClick={handlePaletteButton}>{paletteName}</button>);
  })

  const sliderControls = Object.entries(sliders).map((key, entry) => {
    const [name, value] = key;
    return [
      <label htmlFor={name} key={uuidv4()}>{name}</label>,
      <input id={name} type="range" key={uuidv4()} min="0" max="1024" step="1" defaultValue={value} onChange={handleSliderChange} />
    ]
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
          {sliderControls}
        </form>
      }
    </div>
  )
}

export default Control;
