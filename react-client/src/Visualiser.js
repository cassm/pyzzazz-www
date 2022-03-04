import ReactDOM from 'react-dom'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {v4 as uuidv4} from 'uuid';
import './Visualiser.css';

function Led (props) {
  return (
    <mesh
      {...props}
      scale={0.05}>
      <boxGeometry args={[1,1,1]}/>
      <meshStandardMaterial color="hotpink"/>
    </mesh>
  );
}

const Visualiser = props => {
  return (
    <Canvas className="visualiserCanvas" height="100%">
      <ambientLight />
      {
        props.coords.map(coord => <Led position={coord} key={uuidv4()}/>)
      }
    </Canvas>
  );
}

export default Visualiser;
