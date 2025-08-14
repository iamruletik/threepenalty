import * as THREE from 'three'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'
import { Pane } from 'tweakpane'


export class SceneLights {

  constructor(scene, debug) {
    this.scene = scene
    this.debugPane = debug.addFolder({ title: 'Render Debug' })
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



    const rectAreaLightSideBig = new THREE.RectAreaLight(0xFFFFFF, 0, 28,5)
    rectAreaLightSideBig.rotation.set(0,Math.PI / 2,0)
    rectAreaLightSideBig.position.set(14,-4,0)
    rectAreaLightSideBig.power = 350
    this.scene.add(rectAreaLightSideBig)

    //React Area Light Top
    const rectAreaLightTop = new THREE.RectAreaLight(0xFFFFFF, 0, 10,28)
    rectAreaLightTop.rotation.set(-Math.PI / 2,0,0)
    rectAreaLightTop.position.set(0,8,0)
    rectAreaLightTop.power = 1000
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
    const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLightTop)
    const rectAreaLightBigHelper = new RectAreaLightHelper(rectAreaLightSideBig)
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
      scene.add(rectAreaLightBigHelper) 
    }
    function removeHelpers(scene) { 
      scene.remove(rectAreaLightHelper)
      scene.remove(rectAreaLightSideAHelper)
      scene.remove(rectAreaLightSideBHelper)
      scene.remove(rectAreaLightSideCHelper)
      scene.remove(rectAreaLightSideDHelper)
      scene.remove(rectAreaLightBigHelper)
    }

  }

}