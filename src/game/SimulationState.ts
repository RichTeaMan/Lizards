import { TerrainPiece } from "./terrainPiece";
import { Combatant } from "../Combatant";
import { Projectile } from "../Projectile";
import { MessageRegister } from "../messageBus/MessageRegister";
import { Team } from "../Team";
import { MessageBus } from "../messageBus/messageBus";
import { UiScene } from "./UiScene";
import { GameScene } from "./GameScene";
import { WeaponChoice } from "../ui/WeaponChoice";

export class SimulationState {

    /**
     * Gets the number of turns that have elapsed.
     */
    public turnCount: number = 0;

    private static _current: SimulationState = null;
    public static current(): SimulationState {
        if (!SimulationState._current) {
            SimulationState._current = new SimulationState(new MessageBus());
        }
        return SimulationState._current;
    }

    private _selectedWeapon: WeaponChoice;
    public get selectedWeapon(): WeaponChoice {
        return this._selectedWeapon;
    }

    public gameScene: GameScene;
    public uiScene: UiScene;

    private _height = 100;
    private _width = 100;
    destructibleTerrain: TerrainPiece[] = [];
    readonly terrainPieceSize = 10;

    readonly messageRegister: MessageRegister;

    teams: Team[] = [];
    selectedLizard: Combatant;
    projectiles: Projectile[] = [];

    private lastTeam: Team;

    constructor(messageRegister: MessageRegister) {
        this.messageRegister = messageRegister;
    }

    public updateSelectedWeapon(selectedWeapon: WeaponChoice) {
        this._selectedWeapon = selectedWeapon;
        this.messageRegister.changeWeaponProducer(selectedWeapon.weaponProducer);
    }

    /**
     * Fetches the team team due to have their turn next.
     * A team will have remaining combatants. If no such combatant is found null is returned.
     * Calling this method increments the internal combatant counter.
     */
    fetchNextTeam(): Team {

        if (!this.lastTeam) {
            this.lastTeam = this.teams[0];
        }
        else {
            let nextTeam: Team = null;
            const startIndex = this.teams.indexOf(this.lastTeam);
            let i = startIndex + 1;
            while (!nextTeam) {
                if (i === this.teams.length) {
                    i = 0;
                }
                const team = this.teams[i];
                if (team === this.lastTeam) {
                    // there are no more teams, exit
                    return null;
                }
                else if (team.combatants.length > 0) {
                    nextTeam = team;
                }
                i++;
            }
            this.lastTeam = nextTeam;
        }
        return this.lastTeam;
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

    public fetchTerrainFromBody(impactBody: Phaser.Physics.Impact.Body) {

        let destructibleTerrain: TerrainPiece = null;
        const body = (impactBody as any).body;
        if (body) {
            const gameObject = body.gameObject;
            this.destructibleTerrain.forEach(dt => {
                if ((dt.sprite as any) === gameObject) {
                    destructibleTerrain = dt;
                }
            });
        }
        return destructibleTerrain;
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
            terrainPiece.destroy();
            this.destructibleTerrain = this.destructibleTerrain.filter(t => t !== terrainPiece);
        }
        return terrainPiece;
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

    public get lizards(): Combatant[] {
        return this.teams.flatMap(t => t.combatants);
    }

}
