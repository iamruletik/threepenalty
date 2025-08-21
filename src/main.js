import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'
import CameraControls from 'camera-controls'
import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import * as TweakpaneRotationInputPlugin from "@0b5vr/tweakpane-plugin-rotation"
import { RapierDebugger } from './physicsDebugger.js'
import { SoccerScene } from './soccerScene.js'
import { SoccerBall } from './soccerBall.js'
import { SceneLights } from './sceneLights.js'
import { BottleFinder } from './bottleFinder.js'
import { Loop } from './loop.js'



//Variables
let backgroundColor = 0x050505

//TweakPane Gui
const pane = new Pane()
pane.registerPlugin(EssentialsPlugin)
pane.registerPlugin(TweakpaneRotationInputPlugin)

//Debug Folder
const debug = pane.addFolder({ title: 'Scene Debug' })
let fpsGraph = debug.addBlade({
                                            view: 'fpsgraph',
                                            label: 'FPS',
                                            rows: 2,
                                        })

//Seting the Physics World
let world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 })
world.timestep = 1/60 //Sync to 60 Hz

//Canvas Element
const canvas = document.querySelector('canvas.webgl')

//Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance"  })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(1)
renderer.setClearColor(backgroundColor)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.toneMapping = THREE.LinearToneMapping

//Scene
const scene = new THREE.Scene()
//scene.fog = new THREE.Fog(backgroundColor, 1, 50)
scene.background = new THREE.Color(backgroundColor)

//Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight) // FOV vertical angle, aspect ratio with/height
camera.position.set(0,20,0)
scene.add(camera)

//Loop Module
let loop = new Loop(camera, scene, renderer, world, fpsGraph)
loop.start()


//CameraControls
CameraControls.install({ THREE: THREE })
const cameraControls = new CameraControls( camera, canvas )
cameraControls.maxDistance = 20
cameraControls.maxZoom = 1
cameraControls.minAzimuthAngle = -Math.PI / 2
cameraControls.maxAzimuthAngle = Math.PI / 2
cameraControls.minPolarAngle = -Math.PI / 2
cameraControls.maxPolarAngle = Math.PI / 3
cameraControls.smoothTime = 0.5
loop.updatables.push(cameraControls)


//Debug Render for Physics
const debugButton = debug.addButton({ title: "Show Colliders" })
let debugDataShown = false

let physicsDebugger = new RapierDebugger(scene, world)
debugButton.on('click', () => {
    if (debugDataShown == false) {
        physicsDebugger.addDebugMesh()
        debugDataShown = true
    } else if (debugDataShown) {
        physicsDebugger.removeDebugMesh()
        debugDataShown = false
    }
})
loop.updatables.push(physicsDebugger)

//Adding Lights to the Scene
let sceneLights = new SceneLights(scene, debug)
sceneLights.loadLights()


//Soccer Scene Loading
let soccerScene = new SoccerScene(scene, world, camera, cameraControls)
soccerScene.load()
loop.updatables.push(soccerScene)

//Soccer Ball Object
let soccerBall = new SoccerBall(scene, world)
soccerBall.load()
loop.updatables.push(soccerBall)


//Raycaster
let bottleFinder = new BottleFinder(camera, scene, cameraControls)
bottleFinder.init()
loop.updatables.push(bottleFinder)





// SWIPER BITCH SOSI KIRPI4
import Swiper from 'swiper';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".swiper").forEach((el) => {
    new Swiper(el, {
      modules: [EffectCards],
      effect: "cards",
      grabCursor: true,
      loop: true
    });
  });
});