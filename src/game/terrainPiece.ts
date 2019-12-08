import { SimulationScene } from "./simulationScene";
import { Square } from "./square";

export class TerrainPiece {

    readonly parentScene: SimulationScene;
    readonly x: number;
    readonly y: number;

    onDestroy: (terrainPiece: TerrainPiece) => void;

    constructor(parentScene: SimulationScene, x: number, y: number) {
        this.parentScene = parentScene;
        this.x = x;
        this.y = y;
    }

    calculateRenderSquare(): Square {
        const renderSquare = new Square();
        renderSquare.x = this.parentScene.terrainPieceSize * this.x;
        renderSquare.y = this.parentScene.terrainPieceSize * this.y;
        renderSquare.width = this.parentScene.terrainPieceSize;
        renderSquare.height = this.parentScene.terrainPieceSize;
        return renderSquare;
    }
}