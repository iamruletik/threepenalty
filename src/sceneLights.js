import * as THREE from 'three'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import { Pane } from 'tweakpane'


export class SceneLights {

  constructor(scene, debugPane) {
    this.scene = scene
    this.debugPane = debugPane
  }

  loadLights() {

    RectAreaLightUniformsLib.init()


    //On/Off All Lights Helpers in the Scene
    let lightHelpersVisible = false
    let showRectAreaLightHelper = this.debugPane.addButton({
      title: "Show Light Debug Helpers"
    })
    showRectAreaLightHelper.on('click', () => {
      switch (lightHelpersVisible) {
        case false:
          enableHelpers(this.scene)
          lightHelpersVisible = true
          break;
        case true:
          removeHelpers(this.scene)
          lightHelpersVisible = false
          break;
      }
    })


    //Directional Light For Shadows
    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5)
    directionalLight.position.set(0,11,-6)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.near = 1
    directionalLight.shadow.camera.far = 50
    directionalLight.shadow.camera.top = 40
    directionalLight.shadow.camera.right = 40
    directionalLight.shadow.camera.bottom = - 40
    directionalLight.shadow.camera.left = - 40
    directionalLight.shadow.mapSize.width = 4096
    directionalLight.shadow.mapSize.height = 4096
    directionalLight.shadow.radius = 10
    //directionalLight.lookAt(0,0,0)
    this.scene.add(directionalLight)

    //Add Debug for Directional Light
    let directionalLightDebug = this.debugPane.addFolder({ title: "Directional Light for Shadows", expanded: false })
    directionalLightDebug.addBinding(directionalLight, "intensity")
    directionalLightDebug.addBinding(directionalLight, "position")


    //React Area Light Top
    const rectAreaLightTop = new THREE.RectAreaLight(0xFFFFFF, 0, 16,28)
    rectAreaLightTop.rotation.set(-Math.PI / 2,0,0)
    rectAreaLightTop.position.set(0,8,0)
    rectAreaLightTop.power = 500
    this.scene.add(rectAreaLightTop)

    //Add Debug for Area Light Top
    let rectAreaLightTopDebug = this.debugPane.addFolder({ title: "Area Light Top", expanded: false })
    rectAreaLightTopDebug.addBinding(rectAreaLightTop, "power")
    rectAreaLightTopDebug.addBinding(rectAreaLightTop, "width")
    rectAreaLightTopDebug.addBinding(rectAreaLightTop, "height")
    rectAreaLightTopDebug.addBinding(rectAreaLightTop, "position")
    

    //React Area Light Side A
    const rectAreaLightSideA = new THREE.RectAreaLight(0xFFFFFF, 0, 6,6)
    rectAreaLightSideA.position.set(-10,4,16)
    rectAreaLightSideA.lookAt(0,0,0)
    rectAreaLightSideA.power = 150
    this.scene.add(rectAreaLightSideA)

    //Add Debug for Area Light Side A
    let rectAreaLightSideADebug = this.debugPane.addFolder({ title: "Area Light Side A", expanded: false })
    rectAreaLightSideADebug.addBinding(rectAreaLightSideA, "power")
    rectAreaLightSideADebug.addBinding(rectAreaLightSideA, "width")
    rectAreaLightSideADebug.addBinding(rectAreaLightSideA, "height")
    rectAreaLightSideADebug.addBinding(rectAreaLightSideA, "position")
    // Euler
    rectAreaLightSideADebug.addBinding(rectAreaLightSideA, 'rotation', {
        view: 'rotation',
        rotationMode: 'euler',
        order: 'XYZ', // Extrinsic rotation order. optional, 'XYZ' by default
        unit: 'deg', // or 'rad' or 'turn'. optional, 'rad' by default
      })



    //React Area Light Side B
    const rectAreaLightSideB = new THREE.RectAreaLight(0xFFFFFF, 0, 6,6)
    rectAreaLightSideB.position.set(10,4,16)
    rectAreaLightSideB.lookAt(0,0,0)
    rectAreaLightSideB.power = 150
    this.scene.add(rectAreaLightSideB)

    //Add Debug for Area Light Side B
    let rectAreaLightSideBDebug = this.debugPane.addFolder({ title: "Area Light Side B", expanded: false })
    rectAreaLightSideBDebug.addBinding(rectAreaLightSideB, "power")
    rectAreaLightSideBDebug.addBinding(rectAreaLightSideB, "width")
    rectAreaLightSideBDebug.addBinding(rectAreaLightSideB, "height")
    rectAreaLightSideBDebug.addBinding(rectAreaLightSideB, "position")
    // Euler
    rectAreaLightSideBDebug.addBinding(rectAreaLightSideB, 'rotation', {
        view: 'rotation',
        rotationMode: 'euler',
        order: 'XYZ', // Extrinsic rotation order. optional, 'XYZ' by default
        unit: 'deg', // or 'rad' or 'turn'. optional, 'rad' by default
    })


  //React Area Light Side C
    const rectAreaLightSideC = new THREE.RectAreaLight(0xFFFFFF, 0, 6,6)
    rectAreaLightSideC.position.set(10,4,-16)
    rectAreaLightSideC.lookAt(0,0,0)
    rectAreaLightSideC.power = 150
    this.scene.add(rectAreaLightSideC)

    //Add Debug for Area Light Side C
    let rectAreaLightSideCDebug = this.debugPane.addFolder({ title: "Area Light Side C", expanded: false })
    rectAreaLightSideCDebug.addBinding(rectAreaLightSideC, "power")
    rectAreaLightSideCDebug.addBinding(rectAreaLightSideC, "width")
    rectAreaLightSideCDebug.addBinding(rectAreaLightSideC, "height")
    rectAreaLightSideCDebug.addBinding(rectAreaLightSideC, "position")
    // Euler
    rectAreaLightSideCDebug.addBinding(rectAreaLightSideC, 'rotation', {
        view: 'rotation',
        rotationMode: 'euler',
        order: 'XYZ', // Extrinsic rotation order. optional, 'XYZ' by default
        unit: 'deg', // or 'rad' or 'turn'. optional, 'rad' by default
    })

    //React Area Light Side D
    const rectAreaLightSideD = new THREE.RectAreaLight(0xFFFFFF, 0, 6,6)
    rectAreaLightSideD.position.set(-10,4,-16)
    rectAreaLightSideD.lookAt(0,0,0)
    rectAreaLightSideD.power = 150
    this.scene.add(rectAreaLightSideD)

    //Add Debug for Area Light Side C
    let rectAreaLightSideDDebug = this.debugPane.addFolder({ title: "Area Light Side D", expanded: false })
    rectAreaLightSideDDebug.addBinding(rectAreaLightSideD, "power")
    rectAreaLightSideDDebug.addBinding(rectAreaLightSideD, "width")
    rectAreaLightSideDDebug.addBinding(rectAreaLightSideD, "height")
    rectAreaLightSideDDebug.addBinding(rectAreaLightSideD, "position")
    // Euler
    rectAreaLightSideDDebug.addBinding(rectAreaLightSideD, 'rotation', {
        view: 'rotation',
        rotationMode: 'euler',
        order: 'XYZ', // Extrinsic rotation order. optional, 'XYZ' by default
        unit: 'deg', // or 'rad' or 'turn'. optional, 'rad' by default
    })



    //Light Helpers
    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
    const directionalLightShadowCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLightTop)
    const rectAreaLightSideAHelper = new RectAreaLightHelper(rectAreaLightSideA)
    const rectAreaLightSideBHelper = new RectAreaLightHelper(rectAreaLightSideB)
    const rectAreaLightSideCHelper = new RectAreaLightHelper(rectAreaLightSideC)
    const rectAreaLightSideDHelper = new RectAreaLightHelper(rectAreaLightSideD)

    function enableHelpers(scene) { 
      scene.add(rectAreaLightHelper) 
      scene.add(rectAreaLightSideAHelper) 
      scene.add(rectAreaLightSideBHelper) 
      scene.add(rectAreaLightSideCHelper) 
      scene.add(rectAreaLightSideDHelper) 
      scene.add(directionalLightHelper) 
      scene.add(directionalLightShadowCameraHelper) 
    }
    function removeHelpers(scene) { 
      scene.remove(rectAreaLightHelper)
      scene.remove(rectAreaLightSideAHelper)
      scene.remove(rectAreaLightSideBHelper)
      scene.remove(rectAreaLightSideCHelper)
      scene.remove(rectAreaLightSideDHelper)
      scene.remove(directionalLightHelper)
      scene.remove(directionalLightShadowCameraHelper)
    }

  }

}