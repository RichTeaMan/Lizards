import { SimulationState } from "./game/SimulationState";

export class Explosion {

    x: number;
    y: number;
    force: number = 500;

    /**
     * The damage done by this explosion to combatants. The damage dealt falls off with distance,
     * this value refers to damage done at the centre.
     */
    damage: number = 0;

    /**
     * The distance at which this explosion no longer exerts any force.
     */
    forceFalloff = 100;

    constructor(x: number, y: number, force: number = 500) {
        this.x = x;
        this.y = y;
        this.force = force;
    }

    explode(simulationScene: SimulationState) {

        const originPoint = new Phaser.Geom.Point(this.x, this.y);

        const emitter = simulationScene.gameScene.add.particles('yellow').createEmitter({
            x: this.x,
            y: this.y,
            //speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 2.0, end: 0 },
            blendMode: 'SCREEN',
            //active: false,
            lifespan: 100
        });
        emitter.start();
        simulationScene.gameScene.time.delayedCall(
            300,
            () => { emitter.stop(); },
            null,
            null);

        simulationScene.lizards.forEach(l => {
            const lizardPoint = new Phaser.Geom.Point(l.x, l.y);
            const angle = Phaser.Math.Angle.BetweenPoints(originPoint, lizardPoint);
            const distance = Phaser.Math.Distance.Between(originPoint.x, originPoint.y, lizardPoint.x, lizardPoint.y);

            // normalise range
            let magnitude = 1.0;
            if (distance !== 0.0) {
                magnitude = 1.0 - (distance / this.forceFalloff);
            }
            if (magnitude > 0.0) {

                const velocityX = Math.cos(angle) * this.force * magnitude * l.sprite.body.mass;
                const velocityY = Math.sin(angle) * this.force * magnitude * l.sprite.body.mass;
                l.sprite.setVelocity(velocityX, velocityY);
                l.damage(this.damage * magnitude);
            }
        });

        simulationScene.destructibleTerrain.forEach(dt => {
            const distance = Phaser.Math.Distance.Between(originPoint.x, originPoint.y, dt.renderX, dt.renderY);

            // normalise range
            let magnitude = 1.0;
            if (distance !== 0.0) {
                magnitude = 1.0 - (distance / this.forceFalloff);
            }
            if (magnitude > 0.5) {
                simulationScene.removeTerrain(dt);
            }
        });
    }
}
