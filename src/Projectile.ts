import { Combatant } from "./Combatant";
import { SimulationScene } from "./game/simulationScene";

export class Projectile {

    sprite: Phaser.Physics.Arcade.Sprite;
    collisionEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    travelEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

    /**
     * Indicates if a projectile has exploded and should be removed from the scene.
     */
    exploded: boolean = false;

    

    initialise(simulationScene: SimulationScene,x : number, y: number, velocityX: number, velocityY: number): Projectile {
        this.sprite = simulationScene.scene.physics.add.sprite(x, y, "bazookaRocket");

        this.sprite.body.onCollide = true;
        this.sprite.setVelocityX(velocityX);
        this.sprite.setVelocityY(velocityY);
        
        /*
        this.collisionEmitter = simulationScene.add.particles('spark0').createEmitter({
            x: 400,
            y: 300,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'SCREEN',
            //active: false,
            lifespan: 600,
            gravityY: 800
        });
        */

        this.travelEmitter = simulationScene.scene.add.particles('smoke').createEmitter({
            //x: this.getX(),
            //y: this.getY(),
            //speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'SCREEN',
            //active: false,
            lifespan: 600,
            gravityY: 80
        });
        this.travelEmitter.startFollow(this.sprite);

        return this;
    }

    update(scene: Phaser.Scene): Projectile {
        return this;
    }

    remove(): void {
        this.exploded = true;
        this.sprite.destroy();
        if (this.travelEmitter) {
            this.travelEmitter.stop();
            this.travelEmitter.killAll();
        }
        if (this.collisionEmitter) {
            this.collisionEmitter.stop();
            this.collisionEmitter.killAll();
        }
    }

    getX(): number {
        return this.sprite.x;
    }

    getY(): number {
        return this.sprite.y;
    }

    onCombatantCollision(combatant: Combatant, simulationScene: SimulationScene) {

    }
}
