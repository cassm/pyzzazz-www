import $ from 'jquery';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { io } from 'socket.io-client'
// import {uniform} from "three/examples/jsm/renderers/nodes/ShaderNode";

const _Vs = `
    uniform float scale;
//    varying vec3 v_Normal;
    
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position*scale, 1.0);
    }
`;

const _Fs = `
    uniform vec3 colour;
    
    void main() {
       gl_FragColor = vec4(colour, 1.0);
          // gl_FragColor = vec4(1.0,1.0,1.0,1.0);
    }
`;

const params = {
    fps: 30,
    exposure: 1,
    bloomStrength: 1.5,
    bloomThreshold: 0,
    bloomRadius: 0
};

let coords = [];
let colours = [];
let leds = [];

const socket = io.connect('http://localhost:5000');
socket.on('connect', function() {
    socket.on('colours', (data) => {
        if (data) {
            data = JSON.parse(data);
            colours = data;
            updateColours();
        }
    })
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer({antialias: true});
const controls = new OrbitControls( camera, renderer.domElement );


renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ReinhardToneMapping;
document.body.appendChild( renderer.domElement );

const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

const composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );

camera.position.z = 5;
controls.update();

const geometry = new THREE.SphereGeometry(1.5, 3, 3);

function initLeds() {
    for (let i = 0; i < colours.length; i++) {
        const material = new THREE.ShaderMaterial({
            uniforms: {
                colour: {
                    value: new THREE.Vector3(...colours[i]),
                },
                scale: {
                    value: colours[i][0] + colours[i][1] +
                        colours[i][2]
                }
            },
            vertexShader: _Vs,
            fragmentShader: _Fs,
        });
        const led = new THREE.Mesh( geometry, material );
        led.position.set(coords[i][0]*100, coords[i][2]*100, coords[i][1]*100, )
        leds.push( led );
        scene.add( led );
    }
}

async function getState(url) {
    return $.ajax({
        url,
        type: 'GET',
        dataType: 'json'
    });
}

function animate() {
    requestAnimationFrame( animate );
    // updateColours();
    controls.update();
    // renderer.render(scene, camera);
    composer.render();
}

function updateColours() {
    if (!leds) {
        return
    }
    try {
        for (let i = 0; i < colours.length; i++) {
            if (!leds[i]) {
                return;
            }
            leds[i].material.uniforms.colour.value.set(...colours[i]);
            leds[i].material.uniforms.scale.value = colours[i][0] + colours[i][1] + colours[i][2];
            //TODO must use shaders for this. huge flame point
            // let luminosity = (colours[i].reduce((partialSum, a) => partialSum+a, 0)) / (128*3);
            // leds[i].scale.set(luminosity*1.5, luminosity*1.5, luminosity*1.5);
            // leds[i].material.color.set(`rgb(${colours[i][0]},${colours[i][1]},${colours[i][2]})`);
        }
    } catch (err) {
        console.log(leds.length);
        // console.log(err);
    }
}

$(document).ready(() => {
    getState('http://localhost:5000/leds/coords').then((res) => {
        coords = res;
        return getState('http://localhost:5000/leds/colours');
    }).then((res) => {
        colours = res;
        initLeds();
        socket.emit('ready');

        animate();
    })
})
