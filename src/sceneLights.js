import * as THREE from 'three'
import { Pane } from 'tweakpane'

export class SceneLights {

  constructor(scene, debugPane) {
    this.scene = scene
    this.debugPane = debugPane
  }

  loadLights() {
    //Directional Light
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1)
    directionalLight.castShadow = true
    directionalLight.position.set(0,7,0)
    directionalLight.shadow.camera.near = 1
    directionalLight.shadow.camera.far = 8
    directionalLight.shadow.camera.top = 15
    directionalLight.shadow.camera.right = 10
    directionalLight.shadow.camera.bottom = - 15
    directionalLight.shadow.camera.left = - 10
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    this.scene.add(directionalLight)
    
    //Directional Light Debug
    let directionalLightDebug = this.debugPane.addFolder({ title: 'Directional Light' })
    directionalLightDebug.addBinding(directionalLight.position, "x")
    directionalLightDebug.addBinding(directionalLight.position, "y")
    directionalLightDebug.addBinding(directionalLight.position, "z")
    
    //Directional Light Helper Model
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
    //scene.add(directionalLightHelper)
    //Directional Light Shadow Camera Helper
    const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    //scene.add(directionalLightCameraHelper)
  }

}