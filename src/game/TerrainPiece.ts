import { SimulationState } from "./SimulationState";
import { Square } from "./Square";

export class TerrainPiece {

    readonly simulationScene: SimulationState;
    readonly x: number;
    readonly y: number;

    sprite: Phaser.Physics.Arcade.Sprite;

    constructor(simulationScene: SimulationState, x: number, y: number) {
        this.simulationScene = simulationScene;
        this.x = x;
        this.y = y;
        const sq = this.calculateRenderSquare();
        this.sprite = simulationScene.gameScene.physics.add.sprite(sq.x, sq.y, "foreground");
        this.sprite.debugShowBody = true;
        this.sprite.width = sq.width;
        this.sprite.height = sq.height;
        this.sprite.body.immovable = true;
        (this.sprite.body as any).allowGravity = false;

        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        this.sprite.body.bounce.x = 1;
        this.sprite.body.bounce.y = 1;

        this.sprite.setInteractive().addListener('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.leftButtonDown()) {
                this.destroy();
            }
        });

        return this;
    }

    calculateRenderSquare(): Square {
        const renderSquare = new Square();
        renderSquare.x = this.simulationScene.terrainPieceSize * this.x;
        renderSquare.y = this.simulationScene.terrainPieceSize * this.y;
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
