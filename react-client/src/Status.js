import React from 'react';
import Logo from "./logo";
import FpsView from './FpsView';
import './Status.css';

const Status = props => {
  return (
    <div>
      <h1>Status</h1>

      <Logo size="300" darkMode={false} key="statusLogo"/>
      <FpsView width="40%" height={100} resourcePath='/resource/fps' viewName='Pyzzazz server'/>

    </div>
  )
}

export default Status;
