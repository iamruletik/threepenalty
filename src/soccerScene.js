import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import RAPIER from '@dimforge/rapier3d'
import { RapierDebugger } from './physicsDebugger'

export class SoccerScene {

  constructor(scene, world) {
    this.pathToGLTFScene = '/SoccerFieldNew/SoccerFieldNew.gltf'
    this.pathToGLTFBall = '/SoccerBall/soccerBall.gltf'
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

    //Load the Ball
    this.gltfLoader.load(this.pathToGLTFBall, (gltf) => {
      
        //Iterate through all objects from GLTF file and add them to the provided scene
        const children = [...gltf.scene.children]
        for (const child of children) { this.scene.add(child) }

        //Look for SoccerBall Object and set it to castshadow and change bool to indicate that ball was dowbloaded
        this.soccerBall = this.scene.getObjectByName(this.soccerBallObjectName)
        this.soccerBall.castShadow = true 
        this.ballDownloaded = true 
    })


  //Load Soccer Field
    this.gltfLoader.load(this.pathToGLTFScene, (gltf) => {
      
        //Iterate through all objects from GLTF file and add them to the provided scene
        const children = [...gltf.scene.children]
        for (const child of children) { this.scene.add(child) }
        
        //Find Soccer Field Object and set it to recieve shadows
        this.soccerField = this.scene.getObjectByName(this.soccerFieldObjectName)
        this.soccerField.receiveShadow = true

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