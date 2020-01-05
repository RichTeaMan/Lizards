import { SimulationState } from "./game/SimulationState";
import { ToastPayload } from "./toast/ToastPayload";
import { Team } from "./Team";
export class Combatant {

    private static names: string[] = [
        "Tom",
        "Jordan",
        "Becky",
        "Eleanor",
        "Chris",
        "Ben",
        "Dom",
        "Matt"];

    private _sprite: Phaser.Physics.Arcade.Sprite;
    private _name: string;
    private health: number = 100;
    private nameText: Phaser.GameObjects.Text;
    private nameTextOffsetX: number = -10;
    private nameTextOffsetY: number = -55;
    private healthText: Phaser.GameObjects.Text;
    private healthTextOffsetX: number = -10;
    private healthTextOffsetY: number = -40;
    private jumpVelocity = -120;
    private walkVelocity = 160;
    private _dead: boolean = false;
    private _team: Team;

    public constructor() {
        this._name = Combatant.names[Math.floor(Math.random() * Combatant.names.length)];
    }

    public initialise(scene: Phaser.Scene, x: number, y: number, team: Team): Combatant {

        this._team = team;
        team.combatants.push(this);

        this._sprite = scene.physics.add.sprite(x, y, "lizard")
            .setDragX(100)
            .setScale(0.1)
            .setBounce(0.1)
            .setCollideWorldBounds(true);

        this.nameText = scene.add.text(x, y, this.name);
        this.nameText.setColor(this.team.colour);

        this.healthText = scene.add.text(x, y, this.health.toString());
        this.healthText.setColor(this.team.colour);

        if (Math.random() >= 0.5) {
            this.faceLeft();
        }
        else {
            this.faceRight();
        }

        return this;
    }

    public update(scene: SimulationState): Combatant {

        this.nameText.x = this.x + this.nameTextOffsetX;
        this.nameText.y = this.y + this.nameTextOffsetY;

        if (this.health < 0 && !this.dead) {
            this._dead = true;
            this.healthText.text = "DEAD";
            scene.messageRegister.registerMessage(ToastPayload.createToast(`${this.name} blew up!`));
            this.centerText();
        }
        this.healthText.x = this.x + this.healthTextOffsetX;
        this.healthText.y = this.y + this.healthTextOffsetY;

        return this;
    }

    /**
     * Deals the given amount of damage.
     * @param damage 
     */
    public damage(damage: number): Combatant {

        if (!this.dead) {
            const roundedDamage = Math.ceil(damage);
            this.health += -roundedDamage;
            this.healthText.text = this.health.toString();
            this.centerText();
        }
        return this;
    }

    /**
     * Combatant will face left.
     */
    public faceLeft(): void {
        this.sprite.flipX = true;
    }

    /**
     * Combatant will face right.
     */
    public faceRight(): void {
        this.sprite.flipX = false;
    }

    /**
     * The combatant will move left.
     */
    public velocityLeft(): void {
        this.sprite.setVelocityX(-this.walkVelocity);
        this.faceLeft();
    }

    /**
     * The combatant will move right.
     */
    public velocityRight(): void {
        this.sprite.setVelocityX(this.walkVelocity);
        this.faceRight();
    }

    /**
     * Resets combatant velocity. This will not affect velocity from gravity.
     */
    public velocityReset(): void {
        this.sprite.setVelocityX(0);
    }

    /**
     * The combatant will jump if the combatant is touch the floor. Otherwise no change will happen.
     */
    public jump(): void {
        if (this._sprite.body.touching.down) {
            this.sprite.setVelocityY(this.jumpVelocity);
        }
    }

    private centerText() {
        this.nameTextOffsetX = -(this.nameText.displayWidth / 2);
        this.healthTextOffsetX = -(this.healthText.displayWidth / 2);
    }

    get x(): number {
        return this._sprite.x;
    }

    get y(): number {
        return this._sprite.y;
    }

    get sprite(): Phaser.Physics.Arcade.Sprite {
        return this._sprite;
    }

    get name(): string {
        return this._name;
    }

    get team(): Team {
        return this._team;
    }

    get dead(): boolean {
        return this._dead;
    }
}
