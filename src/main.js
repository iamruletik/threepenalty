import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Pane } from 'tweakpane'
import * as EssentialsPlugin from '@tweakpane/plugin-essentials'
import * as TweakpaneRotationInputPlugin from "@0b5vr/tweakpane-plugin-rotation"
import { RapierDebugger } from './physicsDebugger.js'
import { SoccerScene } from './soccerScene.js'
import { PhysicsScene } from './physicsScene.js'
import { HDRI } from './hdri.js'
import { SceneLights } from './sceneLights.js'

//Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight }
//TweakPane Gui
const pane = new Pane()
pane.registerPlugin(EssentialsPlugin)
pane.registerPlugin(TweakpaneRotationInputPlugin)
//Debug Folder
const playDebug = pane.addFolder({ title: 'Play Debug' })
const debug = pane.addFolder({ title: 'Scene Debug' })
//TweakPane Import/Export
let state = null
debug.addBlade({
  view: 'buttongrid',
  size: [2, 1],
  cells: (x, y) => ({
    title: [
      ['Export', 'Import'],
    ][y][x],
  }),
  label: 'Settings',
}).on('click', (ev) => {
  console.log(ev.index[0])
  switch (ev.index[0]) {
    case 0:
        state = pane.exportState()
        console.log(state)
        var jsonData = JSON.stringify(state, null, 2)
        function download(content) {
            var a = document.createElement("a")
            var file = new Blob([content], { type: 'application/json' });
            a.href = URL.createObjectURL(file)
            a.download = 'tweakpane_state.json'
            a.click()
        }
        download(jsonData)
        break;
    case 1:
        let input = document.getElementById('jsonFileInput')
        input.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const data = JSON.parse(e.target.result);
                        console.log(data);
                        pane.importState(data)
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                };
                reader.readAsText(file);
            }
        })
        input.click()
        
        console.log('imported')
        break;
  }
})
//FPS Counter
const fpsGraph = debug.addBlade({
  view: 'fpsgraph',
  label: 'FPS',
  rows: 2,
})
//Canvas Element
const canvas = document.querySelector('canvas.webgl')
//Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)//Setting pixel ratio
renderer.setClearColor(0x050505) //Background Color
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
//Clock
const clock = new THREE.Clock()
//Scene
const scene = new THREE.Scene()
//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height) // FOV vertical angle, aspect ratio with/height
camera.position.set(0,20,0)
scene.add(camera)
//Orbit Controls
const controls = new OrbitControls( camera, canvas )
controls.enableDamping = true
controls.maxDistance = 20
controls.maxPolarAngle = Math.PI / 3
//Texture Loader
let textureLoader = new THREE.TextureLoader()



//My Scene
//Seting the Physics World
let physicsWorld = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 })
physicsWorld.timestep = 1/60 //Sync to 60 Hz
let physicsScene = new PhysicsScene(physicsWorld, debug)
physicsScene.createScene()

let eventQueue = new RAPIER.EventQueue(true)

//Debug Render for Physics
const debugButton = debug.addButton({ title: "Show Colliders" })
let debugDataShown = false

let physicsDebugger = new RapierDebugger(scene, physicsWorld)
debugButton.on('click', () => {
    if (debugDataShown == false) {
        physicsDebugger.addDebugMesh()
        debugDataShown = true
    } else if (debugDataShown) {
        physicsDebugger.removeDebugMesh()
        debugDataShown = false
    }
})

//Setup Debug Tabs
const debugTabs = debug.addTab({
    pages: [
        { title: "Render" },
        { title: "Physics" }
    ]
})

let backgroundColor = 0x000000


//Adding Lights to the Scene
let sceneLights = new SceneLights(scene, debugTabs.pages[0])
sceneLights.loadLights()





//HDRI Loading
const sceneHDRI = new HDRI(scene, '/hdri.exr')
//sceneHDRI.enable()


//Soccer Scene Loading
let soccerScene = new SoccerScene(scene, physicsWorld)
soccerScene.loadSceneMesh()






//Button Kick

const BUTTON_IDLE = 0, BUTTON_KICK_DIRECTION = 1, BUTTON_KICK_POWER = 2, BUTTON_INACTIVE = -1
let button = playDebug.addButton({ title: "Kick Ball "})
let buttonState = BUTTON_IDLE

let arrowTexture = textureLoader.load('/arrow-texture.png')
let arrowAlphaTexture = textureLoader.load('/arrow-alpha.png')


//Direction Arrow
const ARROW_RIGHT = -1, ARROW_LEFT = 1
let arrowDirection = ARROW_LEFT
let directionArrowParent = new THREE.Group()
let directionArrow = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({
        transparent: true,
        map: arrowTexture,
        alphaMap: arrowAlphaTexture
    })
)
directionArrow.position.set(0,1,-6)
directionArrow.rotation.x = -Math.PI * 0.5

directionArrowParent.position.set(0,0,2)

directionArrowParent.add(directionArrow)


const POWER_DOWN = -1, POWER_UP = 1
let powerDirection = POWER_UP
let powerBar = document.querySelector('.progressBar')
powerBar.value = 0

function animatePowerBar() {
    powerBar.style.display = "block"
    powerBar.value += (0.5 * powerDirection)
    if (powerBar.value >= 20) { powerDirection = POWER_DOWN } 
    if (powerBar.value <= 0) { powerDirection = POWER_UP }
    console.log(powerBar.value)
}


function animateDirectionArrow() {
    directionArrowParent.rotation.y += 0.02 * arrowDirection
    if (directionArrowParent.rotation.y >= 1) { arrowDirection = ARROW_RIGHT } 
    if (directionArrowParent.rotation.y <= -1) { arrowDirection = ARROW_LEFT }
}

button.on("click", (event) => {


        if (buttonState == BUTTON_IDLE) {
            buttonState = BUTTON_KICK_DIRECTION
        } else if (buttonState == BUTTON_KICK_DIRECTION) {
            buttonState = BUTTON_KICK_POWER
        } else if (buttonState == BUTTON_KICK_POWER) {
            buttonState = BUTTON_INACTIVE
            physicsWorld.getRigidBody(0).resetForces()
            physicsWorld.getRigidBody(0).setTranslation({ x: 0.0, y: 0.3, z: 0.0 }, true)
            physicsWorld.getRigidBody(0).setLinvel({ x: 0.0, y: 0.0, z: 0.0 }, true)
            physicsWorld.getRigidBody(0).setAngvel({ x: 3.0, y: 3.0, z: -3.0 }, true)
            //physicsWorld.getRigidBody(0).addForce({ x: ((Math.random()-0.5)*20), y: 6.0, z: (-Math.random()*20) }, true)
            physicsWorld.getRigidBody(0).applyImpulse({ x: (-directionArrowParent.rotation.y*10), y: 5.0, z: -powerBar.value-3 }, true)
        }

}, true)




//Animation Loop Function
const tick = () => {
    fpsGraph.begin()

    const elapsedTime = clock.getElapsedTime() //Built in function in seconds since start


    //Handling Collision Events
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
        console.log('GOAL')
        physicsWorld.getRigidBody(0).sleep()
        physicsWorld.getRigidBody(0).resetForces()
        physicsWorld.getRigidBody(0).setTranslation({ x: 0.0, y: 0.3, z: 0.0 }, true)
        buttonState = BUTTON_IDLE

    })

    //console.log(buttonState)

    if (buttonState == BUTTON_KICK_DIRECTION) {
        scene.add(directionArrowParent)
        animateDirectionArrow()
    }

    if (buttonState == BUTTON_KICK_POWER) {
        animatePowerBar()
    }

    if (buttonState == BUTTON_INACTIVE) {
        powerBar.style.display = "none"
        scene.remove(directionArrowParent)
    }
    


    physicsWorld.step(eventQueue) //Update Physics
    soccerScene.update() //Update Soccer Scene
    physicsDebugger.update() //Update Debug Data in class RapierDebugger
    controls.update() //Update Orbit Controls

    
    renderer.render(scene, camera) //Update Render
    fpsGraph.end() // Update FPS Counter
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