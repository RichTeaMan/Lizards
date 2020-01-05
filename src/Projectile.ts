import { Combatant } from "./Combatant";
import { SimulationState } from "./game/SimulationState";
import { TerrainPiece } from "./game/terrainPiece";

export class Projectile {

    sprite: Phaser.Physics.Arcade.Sprite;
    collisionEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
    travelEmitter: Phaser.GameObjects.Particles.ParticleEmitter;

    /**
     * Indicates if a projectile has exploded and should be removed from the scene.
     */
    exploded: boolean = false;

    

    initialise(simulationScene: SimulationState,x : number, y: number, velocityX: number, velocityY: number): Projectile {
        this.sprite = simulationScene.gameScene.physics.add.sprite(x, y, "bazookaRocket");

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

        this.travelEmitter = simulationScene.gameScene.add.particles('smoke').createEmitter({
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

    /**
     * Moves the projectile with no fanfare.
     */
    remove(): void {
        this.sprite.destroy();
        this.exploded = true;
    }

    /**
     * Explodes and removes the projectile.
     */
    explode(): void {
        this.remove();
        if (this.travelEmitter) {
            this.travelEmitter.stop();
            this.travelEmitter.killAll();
        }
        if (this.collisionEmitter) {
            this.collisionEmitter.stop();
            this.collisionEmitter.killAll();
        }
    }

    get x(): number {
        return this.sprite.x;
    }

    get y(): number {
        return this.sprite.y;
    }

    onCombatantCollision(combatant: Combatant, simulationScene: SimulationState) {
    }

    onTerrainCollision(terrain: TerrainPiece, simulationScene: SimulationState) {
    }
}
