import { TerrainPiece } from "./terrainPiece";
import { Combatant } from "../Combatant";
import { Projectile } from "../Projectile";

export class SimulationScene {

    private _height = 100;
    private _width = 100;
    destructibleTerrain: TerrainPiece[] = [];
    readonly terrainPieceSize = 10;
    readonly scene: Phaser.Scene;

    lizards: Combatant[] = [];
    selectedLizard: Phaser.Physics.Arcade.Sprite;
    projectiles: Projectile[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public fetchCombatant(impactBody: Phaser.Physics.Impact.Body) {

        let lizard: Combatant = null;
        const body = (impactBody as any).body;
        if (body) {
            const gameObject = body.gameObject;
            this.lizards.forEach(l => {
                if ((l.sprite as any) === gameObject) {
                    lizard = l;
                }
            });
        }
        return lizard;
    }

    public fetchProjectile(impactBody: Phaser.Physics.Impact.Body) {

        let projectile: Projectile = null;
        const body = (impactBody as any).body;
        if (body) {
            const gameObject = body.gameObject;
            this.projectiles.forEach(p => {
                if ((p.sprite as any) === gameObject) {
                    projectile = p;
                }
            });
        }
        return projectile;
    }

    public update() {
        // TODO
    }

    public fetchTerrain(x: number, y: number): TerrainPiece {
        let result: TerrainPiece = null;
        const rX = Math.floor(x);
        const rY = Math.floor(y);
        if (x >= 0 && x < this._width && y >= 0 && y < this._height) {
            let foundTile = this.destructibleTerrain.find(t => t.x === rX && t.y === rY);
            if (foundTile) {
                result = foundTile;
            }
        }
        return result;
    }

    public removeTerrainFromCoordinates(x: number, y: number): TerrainPiece {
        const terrain = this.fetchTerrain(x, y);
        return this.removeTerrain(terrain);
    }

    public removeTerrain(terrainPiece: TerrainPiece): TerrainPiece {
        if (terrainPiece) {
            if (terrainPiece.onDestroy) {
                terrainPiece.onDestroy(terrainPiece);
            }
            this.destructibleTerrain = this.destructibleTerrain.filter(t => t !== terrainPiece);
        }
        return terrainPiece;
    }

    public get background(): string {
        return "sky.jpg";
    }

    public get foreground(): string {
        return "smallDirt.png";
    }

    public get lizard(): string {
        return "lizard.png";
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

}
