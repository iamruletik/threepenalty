import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import RAPIER from '@dimforge/rapier3d'

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
        console.log(children)
        this.scene.add(children[0])
        for (const child of children[0].children) { 
          child.castShadow = true
          
        }

        //Look for SoccerBall Object and set it to castshadow and change bool to indicate that ball was dowbloaded
        this.soccerBall = this.scene.getObjectByName(this.soccerBallObjectName)
        this.soccerBall.castShadow = true 
        this.ballDownloaded = true 
    })


  //Load Soccer Field
    this.gltfLoader.load(this.pathToGLTFScene, (gltf) => {

        
      
        //Iterate through all objects from GLTF file and add them to the provided scene
        const children = [...gltf.scene.children]
        for (const child of children) { 
          this.scene.add(child) 
          child.castShadow = true
        }

        createNewCollider("BottleCap01", this.scene, this.world)
        createNewCollider("BottleCap02", this.scene, this.world)
        createNewCollider("BottleCap03", this.scene, this.world)
        createNewCollider("BottleCap04", this.scene, this.world)
        createNewCollider("BottleCap05", this.scene, this.world)
        createNewCollider("BottleCap06", this.scene, this.world)
        createNewCollider("BottleCap07", this.scene, this.world)
        createNewCollider("BottleCap08", this.scene, this.world)
        createNewCollider("BottleCap09", this.scene, this.world)
        createNewCollider("BottleCap10", this.scene, this.world)
        createNewCollider("BottleCap11", this.scene, this.world)
        createNewCollider("BottleCap12", this.scene, this.world)

        let soccerFieldOuter = this.scene.getObjectByName("SoccerFieldOuter")
        soccerFieldOuter.receiveShadow = true

        //Find Soccer Field Object and set it to recieve shadows
        this.soccerField = this.scene.getObjectByName(this.soccerFieldObjectName)
        this.soccerField.receiveShadow = true
        this.soccerField.castShadow = false

        function createNewCollider(objectName, scene, world) {
          let tempMesh = scene.getObjectByName(objectName)
          let newCollider = RAPIER.ColliderDesc.convexHull(tempMesh.geometry.attributes.position.array)
          newCollider.setTranslation(tempMesh.position.x, tempMesh.position.y, tempMesh.position.z)
          world.createCollider(newCollider)
        }

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