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
pane.hidden = true
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
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight) // FOV vertical angle, aspect ratio with/height
camera.position.set(0,35,0)
scene.add(camera)

//CameraControls
CameraControls.install({ THREE: THREE })
const cameraControls = new CameraControls( camera, canvas )
cameraControls.enabled = false
cameraControls.lookInDirectionOf(0, -9, -14, false)
cameraControls.moveTo(0, 2, -2, false)
cameraControls.dolly(22, false)
cameraControls.smoothTime = 0.5


//On/Off All Lights Helpers in the Scene
let enableCameraControls = debug.addButton({
    title: "Enable Camera Controls"
})
enableCameraControls.on('click', () => {
    switch (cameraControls.enabled) {
    case false:
        cameraControls.enabled = true
        break;
    case true:
        cameraControls.enabled = false
        break;
    }
})

//Penalty Module
let penalty = new Penalty(camera, cameraControls, scene, world)
penalty.goalCount = 0



//Adding Lights to the Scene
let sceneLights = new SceneLights(scene, debug)
sceneLights.loadLights()


//Soccer Scene Loading
let soccerScene = new SoccerScene(scene, world, camera, cameraControls)
soccerScene.load()


//Soccer Ball Object
let soccerBall = new SoccerBall(scene, world)
soccerBall.load()





//Loop Module
let loop = new Loop(camera, scene, renderer, world, fpsGraph, penalty)
loop.updatables.push(cameraControls)
loop.updatables.push(soccerScene)
loop.updatables.push(soccerBall)
loop.start()




function runPenalty() {
    //Check if Models are Loaded and Ready
    if (soccerBall.ballDownloaded && soccerScene.soccerFieldDownloaded) { 
        penalty.start()
        loop.updatables.push(penalty)
    } else if (!soccerBall.ballDownloaded || !soccerScene.soccerFieldDownloaded) {
        setTimeout(runPenalty, 100)
    }
}

setTimeout(runPenalty, 100)

 


