import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'
import CameraControls from 'camera-controls'
import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import * as TweakpaneRotationInputPlugin from "@0b5vr/tweakpane-plugin-rotation"
import { SoccerScene } from './soccerScene.js'
import { SoccerBall } from './soccerBall.js'
import { SceneLights } from './sceneLights.js'
import { Penalty } from './penaltyModule.js'
import { Loop } from './loop.js'



//Variables
let backgroundColor = 0x050505

//TweakPane Gui
const pane = new Pane()
//pane.hidden = true
pane.registerPlugin(EssentialsPlugin)
pane.registerPlugin(TweakpaneRotationInputPlugin)

//Debug Folder
const debug = pane.addFolder({ title: 'Scene Debug', expanded: false})
let fpsGraph = debug.addBlade({
                                            view: 'fpsgraph',
                                            label: 'FPS',
                                            rows: 2,
                                        })

//Seting the Physics World
let world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 })
world.timestep = 1 / 30

//Canvas Element
const canvas = document.querySelector('canvas.webgl')

//Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, powerPreference: "high-performance", encoding: THREE.sRGBEncoding })
renderer.setSize(window.innerWidth, window.innerHeight)
//renderer.setPixelRatio(window.devicePixelRatio)
renderer.setPixelRatio(1)
renderer.setClearColor(backgroundColor)
renderer.toneMapping = THREE.ACESFilmicToneMapping

//Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(backgroundColor)

//Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight) // FOV vertical angle, aspect ratio with/height
camera.position.set(0,35,0)
scene.add(camera)

//Penalty Module
let penalty = new Penalty(camera, cameraControls, scene, world)
penalty.goalCount = 0

//Loop Module
let loop = new Loop(camera, scene, renderer, world, fpsGraph, penalty)
loop.start()


//CameraControls
CameraControls.install({ THREE: THREE })
const cameraControls = new CameraControls( camera, canvas )
cameraControls.maxDistance = 35
cameraControls.minDistance = 6
cameraControls.maxZoom = 1
cameraControls.minAzimuthAngle = -Math.PI / 2
cameraControls.maxAzimuthAngle = Math.PI / 2
cameraControls.minPolarAngle = -Math.PI / 2
cameraControls.maxPolarAngle = Math.PI / 3
cameraControls.smoothTime = 0.5
loop.updatables.push(cameraControls)



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




function runPenalty() {
    console.log(soccerBall.ballDownloaded + ' ' + soccerScene.soccerFieldDownloaded)
    if (soccerBall.ballDownloaded && soccerScene.soccerFieldDownloaded) { 
        penalty.init()
        loop.updatables.push(penalty)
    } else if (!soccerBall.ballDownloaded || !soccerScene.soccerFieldDownloaded) {
        setTimeout(runPenalty, 1000)
    }
}

setTimeout(runPenalty, 1000)

 


