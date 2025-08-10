import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class BottleFinder {

    constructor(camera, scene) {
        this.raycaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()
        this.gltfLoader = new GLTFLoader()
        this.intersectors = null
        this.intersectorsDownloaded = false
        this.camera = camera
        this.scene = scene
    }

    onPointerMove(event) {
        //console.log(this.pointer)
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    }

    init() {
        window.addEventListener( 'pointermove', (event) => this.onPointerMove(event) )


        //Load Intersectros
        this.gltfLoader.load("/SoccerFieldNew/SoccerFieldIntersectors.gltf", (gltf) => {
        
            //Iterate through all objects from GLTF file and add them to the provided scene
            this.intersectors = [...gltf.scene.children]
            console.log(this.intersectors)
            this.intersectorsDownloaded = true
            for (const child of this.intersectors) { 
                this.scene.add(child)
            }
        })
    }

    update() {
        if (this.intersectorsDownloaded) {
            this.raycaster.setFromCamera(this.pointer, this.camera)

            const intersects = this.raycaster.intersectObjects(this.intersectors)

            for (const object of this.intersectors) {
                object.material.opacity = 0
            }
            
            for (const intersect of intersects) {
                intersect.object.material.opacity = 1
                console.log(intersect.object.name)
            }
        }
    }
}