import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

export class BottleFinder {

    constructor(camera, scene, controls) {
        this.raycaster = new THREE.Raycaster()
        this.pointer = new THREE.Vector2()
        this.gltfLoader = new GLTFLoader()
        this.spotlightFolder = new THREE.Group()
        this.intersectors = null
        this.intersectorsDownloaded = false
        this.selectedLight = new THREE.SpotLight(0xffffff, 0, Math.PI * 2, Math.PI / 10, 1)
        this.targetObject = new THREE.Object3D()
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

        this.selectedLight.position.set(0, 3, 0)
        this.selectedLight.target = this.targetObject
        let lightHelper = new THREE.SpotLightHelper(this.selectedLight)
        this.spotlightFolder.add(this.selectedLight)
        //this.spotlightFolder.add(lightHelper)
        this.scene.add(this.spotlightFolder)
        this.scene.add(this.targetObject)
        


    }

    update() {
        if (this.intersectorsDownloaded) {
            this.raycaster.setFromCamera(this.pointer, this.camera)

            const intersects = this.raycaster.intersectObjects(this.intersectors)

            for (const object of this.intersectors) {
                this.selectedLight.intensity = 0
            }
            
            for (const intersect of intersects) {
                this.selectedLight.intensity = 200
                this.spotlightFolder.position.x = intersect.object.position.x
                this.spotlightFolder.position.z = intersect.object.position.z

                this.targetObject.position.x = intersect.object.position.x
                this.targetObject.position.z = intersect.object.position.z
            }
        }
    }
}