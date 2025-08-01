import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Pane } from 'tweakpane'
import { RapierDebugger } from './physicsDebugger.js'
import { SoccerScene } from './soccerScene.js'
import { PhysicsScene } from './physicsScene.js'
import { HDRI } from './hdri.js'
import { SceneLights } from './sceneLights.js'

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

//Adding Lights to the Scene
let sceneLights = new SceneLights(scene, debug)
sceneLights.loadLights()


//Seting the Physics World
let physicsWorld = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 })
physicsWorld.timestep = 1/60 //Sync to 60 Hz
let physicsScene = new PhysicsScene(physicsWorld)
physicsScene.createScene()

let eventQueue = new RAPIER.EventQueue(true)


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

    //Handling Collision Events
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
        console.log('GOAL')
        physicsWorld.getRigidBody(0).sleep()
        physicsWorld.getRigidBody(0).resetForces()
        physicsWorld.getRigidBody(0).setTranslation({ x: 0.0, y: 0.3, z: 0.0 }, true)
        physicsWorld.getRigidBody(0).setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true)
        physicsWorld.getRigidBody(0).setAngvel({ x: 3.0, y: 3.0, z: -3.0 }, true)
        //physicsWorld.getRigidBody(0).addForce({ x: ((Math.random()-0.5)*20), y: 6.0, z: (-Math.random()*20) }, true)
        physicsWorld.getRigidBody(0).applyImpulse({ x: ((Math.random()-0.5)*20), y: 5.0, z: (-Math.random()*20) }, true)

        

        
    })


    physicsWorld.step(eventQueue) //Update Physics
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