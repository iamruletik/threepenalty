import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import gsap from 'gsap'



// SWIPER BITCH SOSI KIRPI4
import Swiper from 'swiper';
import { EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';

let swipers = [];

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".swiper").forEach((el) => {

    document.querySelectorAll(".swiper").forEach((el) => {
        swipers.push(new Swiper(el, {
            modules: [EffectCards],
            effect: "cards",
            grabCursor: true,
            loop: true,
        }));
    });
  });
});


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
        this.controls = controls
        this.isCameraAnimating = false
        this.isHovering = false
        this.hoverableIntersector = null
        this.isModalActive = false
    }

    onPointerMove(event) {
        //console.log(this.pointer)
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1
    }

    onPointerClick(event) {

        let modal = document.querySelector(".modalContainer")
        let modalButton = document.querySelector("#closeModal")

        //console.log(this.controls)

        if (this.isHovering && !this.isCameraAnimating && !this.isModalActive) {
            console.log("fired")

            this.isHovering = false
            this.isCameraAnimating = true
            this.isModalActive = true

            let coords = {
                x: this.hoverableIntersector.position.x,
                y: this.hoverableIntersector.position.y,
                z: this.hoverableIntersector.position.z,
            }
            this.controls.enabled = false
            this.controls.lookInDirectionOf(coords.x, coords.y, coords.z, true)
            this.controls.moveTo(coords.x, coords.y, coords.z, true)
            this.controls.dolly(this.camera.position.y - 2, true)
            

            gsap.to(modal, {
                yPercent: -100,
                delay: 1
            })

            modalButton.addEventListener('click', (event) => {        
                //console.log("closed")       
                this.controls.lookInDirectionOf(0, -100, 0, true)                
                this.controls.moveTo(0, 0, 0, true)
                this.controls.dolly(-18, true)
               
                gsap.to(modal, {
                    yPercent: 100,
                    onComplete: () => {
                    // когда анимация закончилась - обновляем все слайдеры
                        swipers.forEach(swiper => swiper.update());
                    }
                })
                this.controls.enabled = true 
                this.isModalActive = false
                this.isCameraAnimating = false
            })
        }

    }

    init() {
        window.addEventListener( 'pointermove', (event) => this.onPointerMove(event) )
        window.addEventListener( 'click', (event) => this.onPointerClick(event))


        //Load Intersectros
        this.gltfLoader.load("/SoccerFieldNew/SoccerFieldIntersectors.gltf", (gltf) => {
        
            //Iterate through all objects from GLTF file and add them to the provided scene
            this.intersectors = [...gltf.scene.children]
            //console.log(this.intersectors)
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
        if (this.intersectorsDownloaded && !this.isCameraAnimating && !this.isModalActive) {
            this.raycaster.setFromCamera(this.pointer, this.camera)

            const intersects = this.raycaster.intersectObjects(this.intersectors)

            for (const object of this.intersectors) {
                this.isHovering = false
                this.selectedLight.intensity = 0
            }
            
            for (const intersect of intersects) {
                this.isHovering = true
                this.hoverableIntersector = intersect.object

                this.selectedLight.intensity = 200
                this.spotlightFolder.position.x = intersect.object.position.x
                this.spotlightFolder.position.z = intersect.object.position.z

                this.targetObject.position.x = intersect.object.position.x
                this.targetObject.position.z = intersect.object.position.z
            }
            
        }
    }
}