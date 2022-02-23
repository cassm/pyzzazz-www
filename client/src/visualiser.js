import $ from 'jquery';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { io } from 'socket.io-client'
// import {uniform} from "three/examples/jsm/renderers/nodes/ShaderNode";

const _Vs = `
    uniform vec3 colour;
    
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position*(colour.x+colour.y+colour.z), 1.0);
    }
`;

const _Fs = `
    uniform vec3 colour;
    
    void main() {
       gl_FragColor = vec4(colour, 1.0);
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
            // loop with length caching is apparently the fastest way to do this
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
                    value: colours[i]
                },
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
    controls.update();
    composer.render();
}

$(document).ready(() => {
    getState('http://localhost:5000/resource/coords').then((res) => {
        coords = res;
        return getState('http://localhost:5000/resource/colours');
    }).then((res) => {
        colours = res;
        initLeds();
        socket.emit('ready');

        animate();
    })
})
