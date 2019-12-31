import { SimulationScene } from "./game/simulationScene";
import { ToastPayload } from "./toast/ToastPayload";
import { Team } from "./Team";

export class Combatant {

    static names: string[] = [
        "Tom",
        "Jordan",
        "Becky",
        "Eleanor",
        "Chris",
        "Ben",
        "Dom",
        "Matt"];

    sprite: Phaser.Physics.Arcade.Sprite;
    name: string;
    health: number = 100;
    nameText: Phaser.GameObjects.Text;
    nameTextOffsetX: number = -10;
    nameTextOffsetY: number = -55;
    healthText: Phaser.GameObjects.Text;
    healthTextOffsetX: number = -10;
    healthTextOffsetY: number = -40;
    dead: boolean = false;
    team: Team;


    constructor() {
        this.name = Combatant.names[Math.floor(Math.random() * Combatant.names.length)];
    }

    initialise(scene: Phaser.Scene, x: number, y: number, team: Team): Combatant {

        this.team = team;
        team.combatants.push(this);

        this.sprite = scene.physics.add.sprite(x, y, "lizard").setDragX(100);
        this.nameText = scene.add.text(x + this.nameTextOffsetX, y + this.nameTextOffsetY, `${this.name} - ${team.name}`);
        this.healthText = scene.add.text(x + this.healthTextOffsetX, y + this.healthTextOffsetY, this.health.toString());

        return this;
    }

    update(scene: SimulationScene): Combatant {

        this.nameText.x = this.x + this.nameTextOffsetX;
        this.nameText.y = this.y + this.nameTextOffsetY;

        if (this.health < 0 && !this.dead) {
            this.dead = true;
            this.healthText.text = "DEAD";
            scene.messageRegister.registerMessage(ToastPayload.createToast(`${this.name} blew up!`));
        }
        this.healthText.x = this.x + this.healthTextOffsetX;
        this.healthText.y = this.y + this.healthTextOffsetY;

        return this;
    }

    /**
     * Deals the given amount of damage.
     * @param damage 
     */
    damage(damage: number): Combatant {

        if (!this.dead) {
            const roundedDamage = Math.ceil(damage);
            this.health += -roundedDamage;
            this.healthText.text = this.health.toString();
        }
        return this;
    }

    get x(): number {
        return this.sprite.x;
    }

    get y(): number {
        return this.sprite.y;
    }
}
