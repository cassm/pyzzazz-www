import React from 'react';
import {useEffect, useState} from "react";
import Logo from "./logo";
import {BarChart, Bar, Cell, ResponsiveContainer, YAxis} from 'recharts';
import {Color} from 'three';
import './Status.css';

// class Status extends React.Component {
const Status = props => {
  const [fpsData, setFpsData] = useState([]);

  useEffect(() => {
    let isCancelled = false;

    async function requestFps() {
      const res = await fetch('/resource/fps');
      const json = await res.json()
      if (!isCancelled) {
        // cap values at 60fps to keep the scale steady
        const dataPoint = {
          pv: Math.min(60, parseFloat(json.fps)),
        };
        setFpsData(fpsData => [...fpsData.slice(-149), dataPoint]);
      }
    }

    const interval = setInterval(requestFps, 1000/30);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [])

  function getBarColor(val) {
    // classify 15fps as worst and 30 as best
    val -= 15;
    val /= 15;

    // clamp between 0 and 1;
    val = Math.min(1.0, Math.max(0, val));

    const barColour = new Color(`hsl(${val*137}, 100%, 57%)`);
    return `#${barColour.getHexString()}`
  }

  return (
    <div>
      <h1>Status</h1>

      <Logo size="300" darkMode={false} key="statusLogo"/>

      <ResponsiveContainer width="50%" height={100} className="fpsGraph">
        <BarChart width="100%" height="100%" barGap={0} barCategoryGap={0} data={fpsData}>
          <YAxis type="number" domain={[0,60]}/>
          <Bar dataKey="pv" isAnimationActive={false}>
            {fpsData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.pv)}/>
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <h2 className="fpsCounter">Pyzzazz server running at {fpsData.length > 0 ?
        (fpsData.reduce((a, b) => ({pv: a.pv + b.pv})).pv / fpsData.length).toFixed(1) :
        '---'} FPS</h2>

    </div>
  )
}

export default Status;
