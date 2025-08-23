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
        this.activeModal = null
        this.activeModalButton = null
        this.penaltyButton = document.querySelector("#penalty")
        this.canvasElement = document.querySelector(".webgl")
        this.onTopOfOtherObjects = false
    }

    onPointerMove(event) {
        //console.log(this.pointer)
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1

        let hoverCheck = document.elementFromPoint(event.clientX, event.clientY)
        if (hoverCheck != this.canvasElement) {
            this.onTopOfOtherObjects = true
        } else if (hoverCheck) {
            this.onTopOfOtherObjects = false
        }
       //console.log(this.onTopOfOtherObjects)
    }

    onPointerClick(event) {

        this.activeModal = document.querySelector(".modalContainer")
        this.activeModalButton = this.activeModal.querySelector("#closeModal")


        if (this.isHovering && !this.isCameraAnimating && !this.isModalActive && !this.onTopOfOtherObjects) {
            
            let intersectorNumber = this.hoverableIntersector.userData.name.slice(-2)
            let bottleCap = null
            let bottle = null

            this.penaltyButton.style.visibility = "hidden"

            console.log(intersectorNumber)

            switch (intersectorNumber) {
                case "01": 
                    bottleCap = this.scene.getObjectByName("BottleCap"+"03")
                    bottle = this.scene.getObjectByName("BottlePlaneBrah")
                    break;
                case "02": 
                    bottleCap = this.scene.getObjectByName("BottleCap"+"07")
                    bottle = this.scene.getObjectByName("BottlePlaneGg")
                    break;
                case "03": 
                    bottleCap = this.scene.getObjectByName("BottleCap"+"09")
                    bottle = this.scene.getObjectByName("BottlePlaneBs")
                    break;
                case "04": 
                    bottleCap = this.scene.getObjectByName("BottleCap"+"01")
                    bottle = this.scene.getObjectByName("BottlePlaneStella")
                    break;
                case "05": 
                    bottleCap = this.scene.getObjectByName("BottleCap"+"05")
                    bottle = this.scene.getObjectByName("BottlePlaneKoz")
                    break;
                case "06": 
                    bottleCap = this.scene.getObjectByName("BottleCap"+"04")
                    bottle = this.scene.getObjectByName("BottlePlaneNtx") 
                    break;
                case "07": 
                    bottleCap = this.scene.getObjectByName("BottleCap"+"06")
                    bottle = this.scene.getObjectByName("BottlePlaneZn")
                    break;
                case "08": 
                    bottleCap = this.scene.getObjectByName("BottleCap"+"02")
                    bottle = this.scene.getObjectByName("BottlePlaneEssa")
                    break;
                case "09": 
                    bottleCap = this.scene.getObjectByName("BottleCap"+"08")
                    bottle = this.scene.getObjectByName("BottlePlaneRf")
                    break;
                case "10": 
                    bottleCap = this.scene.getObjectByName("BottleCap"+"10")
                    bottle = this.scene.getObjectByName("BottlePlaneLowe")
                    break;
                case "11": 
                    bottleCap = this.scene.getObjectByName("BottleCap"+"11")
                    bottle = this.scene.getObjectByName("BottlePlaneHg")
                    break;
                case "12": 
                    bottleCap = this.scene.getObjectByName("BottleCap"+"12")
                    bottle = this.scene.getObjectByName("BottlePlaneAmster")
                    break;
            }

            this.isHovering = false
            this.isCameraAnimating = true
            this.isModalActive = true

            let coords = {
                x: this.hoverableIntersector.position.x,
                y: this.hoverableIntersector.position.y,
                z: this.hoverableIntersector.position.z,
            }

            let distance = this.camera.position.distanceTo(new THREE.Vector3(coords.x, coords.y, coords.z))
            let compensate = Math.min(Math.max(distance, 0), 30)

            this.controls.enabled = false
            this.controls.lookInDirectionOf(coords.x, coords.y, coords.z, true)
            this.controls.moveTo(coords.x, coords.y, coords.z, true)
            this.controls.dolly(compensate, true)
            
            
            this.showModal()

            this.activeModalButton.addEventListener('click', (event) => {      
                this.resetCamera()  
                this.closeModal()
            })
        }

    }

    resetCamera() {
            //console.log("closed")       
            this.controls.lookInDirectionOf(0, -100, 0, true)                
            this.controls.moveTo(0, 0, 0, true)
            this.controls.dolly(-30, true)

            this.controls.enabled = true 
            this.isCameraAnimating = false
    }

    closeModal() {
            gsap.to(this.activeModal, { yPercent: 100 })
            this.isModalActive = false
            this.penaltyButton.style.visibility = "visible"
    }

    showModal() {
        //Show Modal
        gsap.to(this.activeModal, {
            yPercent: -100,
            delay: 1
        })
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
        if (this.intersectorsDownloaded && !this.isCameraAnimating && !this.isModalActive && !this.onTopOfOtherObjects) {
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