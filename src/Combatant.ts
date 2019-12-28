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

    constructor() {
        this.name = Combatant.names[Math.floor(Math.random() * Combatant.names.length)];
    }

    initialise(scene: Phaser.Scene, x: number, y: number): Combatant {
        this.sprite = scene.physics.add.sprite(x, y, "lizard");
        this.nameText = scene.add.text(x, y, this.name);

        return this;
    }

    update(scene: Phaser.Scene): Combatant {

        this.nameText.x = this.getX();
        this.nameText.y = this.getY();
        return this;
    }

    getX(): number {
        return this.sprite.x;
    }

    getY(): number {
        return this.sprite.y;
    }
}
