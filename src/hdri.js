import * as THREE from 'three'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js' 

export class HDRI {

  constructor(scene, path) {
    this.scene = scene
    this.path = path
    this.exrLoader = new EXRLoader()
    this.environmentIntensity = 0.5
    this.backgroundIntensity = 1
    this.enableBackground = false
  }

  enable() {
    this.exrLoader.load(this.path, (environmentMap) => {

        environmentMap.mapping = THREE.EquirectangularReflectionMapping

        this.scene.environment = environmentMap
        this.scene.environmentIntensity = this.environmentIntensity
        

        if (this.enableBackground) {
            this.scene.background = environmentMap
            this.scene.backgroundIntensity = this.backgroundIntensity
        }
        
    }) 
  }

}
