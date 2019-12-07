import skyImg from "../assets/sky.jpg";
import dirtImg from "../assets/dirt.jpg";
import { TerrainPiece } from "./terrainPiece";

export class SimulationScene {

    private _height = 100;
    private _width = 100;
    private _destructibleTerrain: TerrainPiece[];
    readonly terrainPieceSize = 10;

    constructor() {
        this._destructibleTerrain = [];
        for (let i = 0; i < this._width; i++) {

            for (let j = this._height / 2; j < this._height; j ++) {
                this._destructibleTerrain.push(new TerrainPiece(this, i, j));
            }
        }
    }

    public update() {
        // TODO
    }

    public get background(): string {
        return skyImg;
    }

    public get foreground(): string {
        return dirtImg;
    }

    public get destructibleTerrain(): TerrainPiece[] {
        return this._destructibleTerrain;
    }

    public fetchTerrain(x: number, y: number): TerrainPiece {
        let result: TerrainPiece = null;
        const rX = Math.floor(x);
        const rY = Math.floor(y);
        if (x >= 0 && x < this._width && y >= 0 && y < this._height) {
            let foundTile = this._destructibleTerrain.find(t => t.x === rX && t.y === rY);
            if (foundTile) {
                result = foundTile;
            }
        }
        return result;
    }

    public removeTerrain(x: number, y:number): TerrainPiece {
        const terrain = this.fetchTerrain(x, y);
        if (terrain) {
            this._destructibleTerrain = this._destructibleTerrain.filter(t => t !== terrain);
        }
        return terrain;
    }

}
