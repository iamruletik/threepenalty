import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {Pane} from 'tweakpane'
//Sizes
const sizes = { width: window.innerWidth, height: window.innerHeight }
//TweakPane Gui
const pane = new Pane()
const paneFolder = pane.addFolder({ title: 'Soccer GUI' })
//Canvas Element
const canvas = document.querySelector('canvas.webgl')
//Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))//Setting pixel ratio
//Clock
const clock = new THREE.Clock()
//Scene
const scene = new THREE.Scene()
//Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height) // FOV vertical angle, aspect ratio with/height
camera.position.set(1,1,1)
scene.add(camera)
//Orbit Controls
const controls = new OrbitControls( camera, canvas )

//Rapier World
let physicsWorld = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 })


//My Scene

















//Animation Loop Function
const tick = () => {
    const elapsedTime = clock.getElapsedTime() //Built in function in seconds since start







    camera.lookAt(new THREE.Vector3()) //Look At Center
    renderer.render(scene, camera) //Update Render
    physicsWorld.step() //Update Physics
    controls.update() //Update Orbit Controls
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