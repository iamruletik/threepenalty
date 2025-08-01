import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import RAPIER from '@dimforge/rapier3d'

export class SoccerScene {

  constructor(scene, world) {
    this.pathToGLTFScene = '/soccerfield.gltf'
    this.soccerBall = null
    this.soccerBallObjectName = "SoccerBall"
    this.soccerField = null
    this.soccerFieldObjectName = "SoccerField"
    this.ballDownloaded = false
    this.gltfLoader = new GLTFLoader()
    this.scene = scene
    this.world = world
  }

  loadSceneMesh() {

    this.gltfLoader.load(this.pathToGLTFScene, (gltf) => {

        //Iterate through all objects from GLTF file and add them to the provided scene
        const children = [...gltf.scene.children]
        for (const child of children) { this.scene.add(child) }

        //Look for SoccerBall Object and set it to castshadow and change bool to indicate that ball was dowbloaded
        this.soccerBall = this.scene.getObjectByName(this.soccerBallObjectName)
        this.soccerBall.castShadow = true 
        this.ballDownloaded = true 
        
        //Find Soccer Field Object and set it to recieve shadows
        this.soccerField = this.scene.getObjectByName(this.soccerFieldObjectName)
        this.soccerField.receiveShadow = true

        //Iterate through all mesh objects in Soccer Field and set them to recieve shadows
        const soccerFieldChildren = [...this.soccerField.children]
        for (const child of soccerFieldChildren) { child.receiveShadow = true}

    })
    
  }

  update() {

    //You Can find specific RigidBody by its handle
    let soccerBallRigidBody = this.world.getRigidBody(0)

    if (this.ballDownloaded) {
        this.soccerBall.position.copy(soccerBallRigidBody.translation())
        this.soccerBall.setRotationFromQuaternion(soccerBallRigidBody.rotation())
    }

  }

}