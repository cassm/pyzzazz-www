import ReactDOM from 'react-dom'
import React, {useEffect, useRef, useState} from 'react'
import {Canvas, useFrame, useThree, extend} from '@react-three/fiber'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {v4 as uuidv4} from 'uuid';
import {io} from 'socket.io-client'
import './Visualiser.css';

extend({OrbitControls});

const vertexShader = `
    uniform vec3 colour;
 
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position*(colour.x+colour.y+colour.z), 1.0);
    }
`;

const fragmentShader = `
    uniform vec3 colour;

    void main() {
       gl_FragColor = vec4(colour, 1.0);
    }
`;

const Visualiser = props => {
  function generateMaterialData(colourVal) {
    return {
      uniforms: {
        colour: {
          value: colourVal
        }
      },
      fragmentShader,
      vertexShader
    }
  }

  function Led(props) {
    return (
      <mesh
        {...props}
        scale={0.05}>
        <sphereGeometry attach="geometry" args={[0.25, 3, 3]}/>
        <shaderMaterial attach="material" {...generateMaterialData(props.colour)}/>
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

  let colours = props.coords.map(_ => [0.4588, 0.0, 0.1529]);
  let [frame, setFrame] = useState(false);

  useEffect(() => {
    if (!props.loading) {
      const socket = io.connect('/');
      socket.on('connect', function () {
        socket.emit('ready');
        socket.on('colours', async (data) => {
          if (data) {
            data = await JSON.parse(data);
            let pixel = 0;
            let channel = 0;
            let pixelLength = colours.length;
            let channelLength = 3;

            while (pixel < pixelLength) {
              channel = 0;

              while (channel < channelLength) {
                colours[pixel][channel] = data[pixel][channel];
                channel++;
              }
              pixel++;
            }
          }
        });
      });
    }
  }, [props.loading])

  const VisualiserCanvas = (props) => {
    const yTotal = props.coords.reduce(function sumZ(a, b) { return a + b[2];}, 0);
    const yAvg = yTotal / props.coords.length;

    const zMax = props.coords.reduce(function sumZ(a, b) { return Math.max(a, b[0]);}, 0);

    return (
      <Canvas camera={{ fov: 75, position: [0,0, zMax*2]}} height="100%">
        <CameraControls/>
        <ambientLight/>
        {
          props.coords.map((coord, index) => <Led
            position={[coord[1], coord[2]-yAvg*2, coord[0]]}
            key={uuidv4()}
            colour={colours[index]}/>)
        }
      </Canvas>
    );
  }

  return (
    <div className="visualiserCanvas">
      {
        props.loading ?
          <h1>Loading....</h1> :
          <VisualiserCanvas {...props}/>
      }
    </div>
  );
}

export default Visualiser;
