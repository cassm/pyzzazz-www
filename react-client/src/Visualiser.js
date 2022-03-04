import ReactDOM from 'react-dom'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {v4 as uuidv4} from 'uuid';
import './Visualiser.css';

// Extend will make OrbitControls available as a JSX element called orbitControls for us to use.
extend({ OrbitControls });

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

const CameraControls = () => {
  const {
    camera,
    gl: {domElement},
  } = useThree();
  const controls = useRef();
  useFrame((state) => controls.current.update());
  return <orbitControls ref={controls} args={[camera, domElement]}/>;
}

const Visualiser = props => {
  return (
    <Canvas className="visualiserCanvas" height="100%">
      <CameraControls/>
      <ambientLight />
      {
        props.coords.map(coord => <Led
          position={[coord[1],coord[2],coord[0]]}
          key={uuidv4()}/>)
      }
    </Canvas>
  );
}

export default Visualiser;
