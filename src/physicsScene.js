import RAPIER from '@dimforge/rapier3d'

export class PhysicsScene {

  constructor(world, debugPane) {
    this.world = world
    this.debugPane = debugPane
  }

  createScene() {

        //Floor Collider
        let floorCollider = RAPIER.ColliderDesc.cuboid(9.0, 0.1, 14)
        floorCollider.setTranslation(0,-1.9,0)
        this.world.createCollider(floorCollider)

        //Left Side Wall Collider
        let sideLeftCollider = RAPIER.ColliderDesc.cuboid(1.5, 1, 14.0)
        sideLeftCollider.setTranslation(-9,-1,0)
        this.world.createCollider(sideLeftCollider)

        //Left Top Side Wall Collider
        let sideLeftTopCollider = RAPIER.ColliderDesc.cuboid(1.5, 1, 14.0)
        sideLeftTopCollider.setTranslation(-9,-0.5,0)
        sideLeftTopCollider.setRotation({ w: 1.0, x: 0.0, y: 0.0, z: -0.1 })
        this.world.createCollider(sideLeftTopCollider)

        //Left Outer Side Wall Collider
        let sideLeftOuterCollider = RAPIER.ColliderDesc.cuboid(1.5, 20, 14.0)
        sideLeftOuterCollider.setTranslation(-11,0,0)
        this.world.createCollider(sideLeftOuterCollider)


         //Right Top Side Wall Collider
        let sideRightTopCollider = RAPIER.ColliderDesc.cuboid(1.5, 1, 14.0)
        sideRightTopCollider.setTranslation(9,0,0)
        sideRightTopCollider.setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.1 })
        this.world.createCollider(sideRightTopCollider)

        //Right Side Wall Collider
        let sideRightCollider = RAPIER.ColliderDesc.cuboid(1.5, 1, 14.0)
        sideRightCollider.setTranslation(9,-1,0)
        this.world.createCollider(sideRightCollider)

        //Left Outer Side Wall Collider
        let sideRightOuterCollider = RAPIER.ColliderDesc.cuboid(1.5, 20, 14.0)
        sideRightOuterCollider.setTranslation(11,0,0)
        this.world.createCollider(sideRightOuterCollider)

        // Soccer Gate Sensor
        let gateSensor = RAPIER.ColliderDesc.cuboid(3, 2, 1)
                  .setSensor(true)
                  .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
        gateSensor.setTranslation(0,-1.5,-11.8)
        this.world.createCollider(gateSensor)



        // Create a dynamic rigid-body for a Ball
        let ballRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0.0, 1.0, 0.0)
            .setAdditionalMass(0.5)
        let ballRigidBody = this.world.createRigidBody(ballRigidBodyDesc)
        
        // Create a ball collider attached to the dynamic rigidBody.
        let ballColliderDesc = RAPIER.ColliderDesc.ball(0.55).setDensity(0.5)
        let ballCollider = this.world.createCollider(ballColliderDesc, ballRigidBody)
    
  }

}


