import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Pane } from 'tweakpane'
import { RapierDebugger } from './physicsDebugger.js'
import { SoccerScene } from './soccerScene.js'
import { PhysicsScene } from './physicsScene.js'
import { HDRI } from './hdri.js'

//Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight }
//TweakPane Gui
const pane = new Pane()
const debug = pane.addFolder({ title: 'Soccer GUI' })
//Canvas Element
const canvas = document.querySelector('canvas.webgl')
//Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)//Setting pixel ratio
renderer.setClearColor(0x87CEEB) //Instead of black background
renderer.shadowMap.enabled = true
//Clock
const clock = new THREE.Clock()
//Scene
const scene = new THREE.Scene()
//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height) // FOV vertical angle, aspect ratio with/height
camera.position.set(0,10,10)
scene.add(camera)
//Orbit Controls
const controls = new OrbitControls( camera, canvas )



//My Scene

//Lights

//Directional Light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
directionalLight.castShadow = true
directionalLight.position.set(0,7,0)
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 8
directionalLight.shadow.camera.top = 15
directionalLight.shadow.camera.right = 10
directionalLight.shadow.camera.bottom = - 15
directionalLight.shadow.camera.left = - 10
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
scene.add(directionalLight)

//Directional Light Debug
let directionalLightDebug = debug.addFolder({ title: 'Directional Light' })
directionalLightDebug.addBinding(directionalLight.position, "x")
directionalLightDebug.addBinding(directionalLight.position, "y")
directionalLightDebug.addBinding(directionalLight.position, "z")

//Directional Light Helper Model
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
//scene.add(directionalLightHelper)
//Directional Light Shadow Camera Helper
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
//scene.add(directionalLightCameraHelper)



//Seting the Physics World
let physicsWorld = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 })
let physicsScene = new PhysicsScene(physicsWorld)
physicsScene.createScene()


//HDRI Loading
const sceneHDRI = new HDRI(scene, '/hdri.exr')
sceneHDRI.enable()


//Soccer Scene Loading
let soccerScene = new SoccerScene(scene, physicsWorld)
soccerScene.loadSceneMesh()



//Debug Render
let physicsDebugger = new RapierDebugger(scene, physicsWorld)
physicsDebugger.addDebugMesh()






//Animation Loop Function
const tick = () => {
    const elapsedTime = clock.getElapsedTime() //Built in function in seconds since start

    camera.lookAt(new THREE.Vector3()) //Look At Center

    physicsWorld.step() //Update Physics
    soccerScene.update() //Update Soccer Scene
    physicsDebugger.update() //Update Debug Data in class RapierDebugger
    controls.update() //Update Orbit Controls

    
    renderer.render(scene, camera) //Update Render
    window.requestAnimationFrame(tick) //Request next frame of animation lopp
}
tick()



//Resize Function
window.addEventListener('resize', () => {
    
    //Update Sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix() // Update Camera

    renderer.setSize(sizes.width, sizes.height) //Update Renderer - Better put here so user when moving windows from screen to screen would recieve better expirience

})