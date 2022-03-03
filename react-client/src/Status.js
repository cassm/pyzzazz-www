import React from 'react';
import Logo from "./logo";
import FpsView from './FpsView';
import './Status.css';

const Status = props => {
  const fixtureInstances = [];

  if (!props.loading) {
    for (const [_, entry] of Object.entries(props.fixtures['Fixture']['LedFixture'])) {
      fixtureInstances.push(...entry.instances);
    }
  }

  return (
    <div>
      <h1>Status</h1>

      <Logo size="300" darkMode={false} key="statusLogo"/>
      <FpsView width="40%" height={100} resourcePath='/resource/fps' viewName='Pyzzazz server'/>
      <h3>{props.loading ? 'Loading...' : `Mapping ${props.coords.length} LEDs over ${fixtureInstances.length} fixtures. No big deal ;-)`}</h3>

    </div>
  )
}

export default Status;
