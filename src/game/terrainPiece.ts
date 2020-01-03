import { SimulationScene } from "./simulationScene";
import { Square } from "./square";

export class TerrainPiece {

    readonly simulationScene: SimulationScene;
    readonly x: number;
    readonly y: number;

    sprite: Phaser.Physics.Arcade.Sprite;

    constructor(simulationScene: SimulationScene, x: number, y: number) {
        this.simulationScene = simulationScene;
        this.x = x;
        this.y = y;
        const sq = this.calculateRenderSquare();
        this.sprite = simulationScene.scene.physics.add.sprite(sq.x, sq.y, "foreground");
        this.sprite.debugShowBody = true;
        this.sprite.width = sq.width;
        this.sprite.height = sq.height;
        this.sprite.body.immovable = true;
        (this.sprite.body as any).allowGravity = false;

        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.sprite.body.bounce.x = 1;
        this.sprite.body.bounce.y = 1;

        this.sprite.setInteractive().addListener('pointerdown', (pointer, localX, localY, event) => {
            this.destroy();
        });

        return this;
    }

    calculateRenderSquare(): Square {
        const renderSquare = new Square();
        renderSquare.x = this.simulationScene.renderOffsetX + (this.simulationScene.terrainPieceSize * this.x);
        renderSquare.y = this.simulationScene.renderOffsetY + (this.simulationScene.terrainPieceSize * this.y);
        renderSquare.width = this.simulationScene.terrainPieceSize;
        renderSquare.height = this.simulationScene.terrainPieceSize;
        return renderSquare;
    }

    destroy() {
        this.sprite.destroy();
    }

    get renderX(): number {
        return this.sprite.x;
    }

    get renderY(): number {
        return this.sprite.y;
    }
}
