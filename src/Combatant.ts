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


    constructor() {
        this.name = Combatant.names[Math.floor(Math.random() * Combatant.names.length)];
    }

    initialise(scene: Phaser.Scene, x: number, y: number): Combatant {
        this.sprite = scene.physics.add.sprite(x, y, "lizard").setDragX(100);
        this.nameText = scene.add.text(x + this.nameTextOffsetX, y + this.nameTextOffsetY, this.name);
        this.healthText = scene.add.text(x + this.healthTextOffsetX, y + this.healthTextOffsetY, this.health.toString());

        return this;
    }

    update(scene: Phaser.Scene): Combatant {

        this.nameText.x = this.getX() + this.nameTextOffsetX;
        this.nameText.y = this.getY() + this.nameTextOffsetY;

        this.healthText.x = this.getX() + this.healthTextOffsetX;
        this.healthText.y = this.getY() + this.healthTextOffsetY;

        return this;
    }

    /**
     * Deals the given amount of damage.
     * @param damage 
     */
    damage(damage: number): Combatant {

        const roundedDamage = Math.ceil(damage);
        // TODO: what if dead?
        this.health += -roundedDamage;

        this.healthText.text = this.health.toString();

        return this;
    }

    getX(): number {
        return this.sprite.x;
    }

    getY(): number {
        return this.sprite.y;
    }
}
