export class Combatant {

    sprite: Phaser.Physics.Arcade.Sprite;
    name: string;
    health: number = 100;

    constructor(sprite: Phaser.Physics.Arcade.Sprite) {
        this.sprite = sprite;
        this.name = "?";
    }
}
