import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js' 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import {Pane} from 'tweakpane'
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
//GLTFLoader
const gltfLoader = new GLTFLoader()
//Rapier World
let physicsWorld = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 })



//My Scene

//Lights

//Directional Light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
directionalLight.castShadow = true
directionalLight.position.set(0,5,0)
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
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
scene.add(directionalLightHelper)
//Directional Light Shadow Camera Helper
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

//HDRI Loading
const exrLoader = new EXRLoader()
exrLoader.load('/hdri.exr', (environmentMap) => {
    //console.log(environmentMap)
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    //scene.background = environmentMap
    scene.environment = environmentMap
    scene.environmentIntensity = 0.5
    //scene.backgroundIntensity = 0.02
}) 

let soccerBall, soccerField

//Loading Soccer Field
gltfLoader.load(
    '/soccerfield.gltf',
    
    (gltf) => {
        //console.log(gltf)

        const children = [...gltf.scene.children]

        for (const child of children) {
            scene.add(child)
            console.log('added')
        }


        console.log(scene.children)
        soccerBall = scene.getObjectByName("SoccerBall")
        soccerBall.castShadow = true

        let ballDebug = debug.addFolder({ title: 'Soccer Ball' })
        ballDebug.addBinding(soccerBall.position, "x")
        ballDebug.addBinding(soccerBall.position, "y")
        ballDebug.addBinding(soccerBall.position, "z")

        
        
        soccerField = scene.getObjectByName("SoccerField")
        soccerField.receiveShadow = true
        const soccerFieldChildren = [...soccerField.children]
        console.log(soccerFieldChildren)

        for (const child of soccerFieldChildren) {
            child.receiveShadow = true
        }

    }
)
















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