import RAPIER from '@dimforge/rapier3d'

export class PhysicsScene {

  constructor(world) {
    this.world = world
  }

  createScene() {

        let floorCollider = RAPIER.ColliderDesc.cuboid(9.0, 0.1, 16.5)
        floorCollider.setTranslation(0,-0.6,0)
        this.world.createCollider(floorCollider)

        let leftWallCollider = RAPIER.ColliderDesc.cuboid(0.1, 8.0, 16.5)
        leftWallCollider.setTranslation(-9,7,0)
        this.world.createCollider(leftWallCollider)

        let rightWallCollider = RAPIER.ColliderDesc.cuboid(0.1, 8.0, 16.5)
        rightWallCollider.setTranslation(9,7,0)
        this.world.createCollider(rightWallCollider)

        let topWallCollider = RAPIER.ColliderDesc.cuboid(9.0, 8.0, 0.1)
        topWallCollider.setTranslation(0,7,-16.5)
        this.world.createCollider(topWallCollider)

        let backWallCollider = RAPIER.ColliderDesc.cuboid(9.0, 8.0, 0.1)
        backWallCollider.setTranslation(0,7,16.5)
        this.world.createCollider(backWallCollider)

        let gateSensor = RAPIER.ColliderDesc.cuboid(10, 3, 3)
                  .setSensor(true)
                  .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)
        gateSensor.setTranslation(0,-0.6,-14.5)
        this.world.createCollider(gateSensor)



        // Create a dynamic rigid-body.
        let ballRigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(0.0, 1.0, 0.0)
            //.setLinvel(0.0, 2.0, -10.0)
            //.setAngvel({ x: 3.0, y: 3.0, z: -3.0 })
            .setAdditionalMass(0.5)
            //.setLinearDamping(0.2)
            //.setAngularDamping(0.2)
        let ballRigidBody = this.world.createRigidBody(ballRigidBodyDesc)
        //ballRigidBody.addForce({ x: 0.0, y: 1.0, z: -5.0 }, true)

        //console.log(ballRigidBody.isMoving())
        
        // Create a ball collider attached to the dynamic rigidBody.
        let ballColliderDesc = RAPIER.ColliderDesc.ball(0.55).setDensity(0.5)
        let ballCollider = this.world.createCollider(ballColliderDesc, ballRigidBody)
    
  }

}


