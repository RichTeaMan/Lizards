import * as Phaser from 'phaser';
import { SimulationScene } from './simulationScene';

let simulationScene: SimulationScene;

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Sample',

    type: Phaser.AUTO,

    parent: "game-container",
    width: 1000,
    height: 1000,

    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 200 }
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },

    backgroundColor: '#000000',
};

function preload() {
    simulationScene = new SimulationScene();
    const scene = this as Phaser.Scene;
    scene.load.image("background", `assets/${simulationScene.background}`);
    scene.load.image("foreground", `assets/${simulationScene.foreground}`);
    scene.load.image("lizard", "assets/lizard.png");
    scene.load.image("bazookaRocket", "assets/bazookaRocket.png");
}

const terrainSprites: Phaser.Physics.Arcade.Sprite[] = [];
let lizards: Phaser.Physics.Arcade.Sprite[] = [];
let selectedLizard: Phaser.Physics.Arcade.Sprite;
let projectiles: Phaser.Physics.Arcade.Sprite[] = [];

function create() {

    const scene = this as Phaser.Scene;
    render(scene);

    lizards.push(scene.physics.add.sprite(100, 200, "lizard"));
    lizards.push(scene.physics.add.sprite(200, 400, "lizard"));
    lizards.push(scene.physics.add.sprite(325, 350, "lizard"));
    lizards.push(scene.physics.add.sprite(465, 100, "lizard"));
    lizards.push(scene.physics.add.sprite(700, 320, "lizard"));

    lizards.forEach(l => {
        l.scale = 0.1;
        l.setBounce(0.1).setCollideWorldBounds(true);
    });
    selectedLizard = lizards[0];

    simulationScene.destructibleTerrain.forEach(terrain => {
        const sq = terrain.calculateRenderSquare();
        const sprite = scene.physics.add.sprite(sq.x, sq.y, "foreground");
        sprite.debugShowBody = true;
        sprite.width = sq.width;
        sprite.height = sq.height;
        sprite.body.immovable = true;
        (sprite.body as any).allowGravity = false;

        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;
        sprite.body.bounce.x = 1;
        sprite.body.bounce.y = 1;

        terrainSprites.push(sprite);

        sprite.setInteractive().addListener('pointerdown', (pointer, localX, localY, event) => {
            simulationScene.removeTerrain(terrain);
        });

        scene.physics.world.on('collide', (body: Phaser.Physics.Impact.Body, other: Phaser.Physics.Impact.Body, axis: string) => {

            body.destroy();
            other.destroy();
            
            console.log(body);
            console.log(other);
            console.log(axis);
        });

        terrain.onDestroy = (t) => {
            sprite.destroy();
        };
    });

    scene.input.keyboard.on('keydown', function (event: KeyboardEvent) {
        if (event.code === 'Space') {
            const projectile = scene.physics.add.sprite(selectedLizard.x, selectedLizard.y, "bazookaRocket");
            projectile.body.onCollide = true;

            const velocity = 500;

            const x = scene.input.activePointer.x;
            const y = scene.input.activePointer.y;

            const xD = x - selectedLizard.x;
            const yD = y - selectedLizard.y;

            const angle = Math.atan(yD / xD);
            let xR = velocity * Math.cos(angle);
            let yR = velocity * Math.sin(angle);

            if (xD < 0) {
                xR = -xR;
                yR = -yR;
            }

            projectile.setVelocityX(xR);
            projectile.setVelocityY(yR);

            projectiles.push(projectile);
        }
    });

}

function render(scene: Phaser.Scene) {

    const logo = scene.add.image(0, 0, "background");

    logo.scaleY = (logo.height * 2) / Number(gameConfig.height);
    logo.scaleX = (logo.width * 2) / Number(gameConfig.width);
}

/**
 * This method is called once per game step while the scene is running.
 * 
 * @param time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
function update(time: number, delta: number) {

    const scene = this as Phaser.Scene;

    terrainSprites.forEach(s => {
        lizards.forEach(l => {
            scene.physics.world.collide(s, l);
        });

        projectiles.forEach(p => {
            scene.physics.world.collide(s, p);
        });
    });

    const cursors = scene.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
        selectedLizard.setVelocityX(-160);
    }
    else if (cursors.right.isDown) {
        selectedLizard.setVelocityX(160);
    }
    else {
        selectedLizard.setVelocityX(0);
    }
    if (cursors.up.isDown && selectedLizard.body.touching.down) {
        selectedLizard.setVelocityY(-120);
    }
}

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
};

export class GameScene extends Phaser.Scene {
    private square: Phaser.GameObjects.Rectangle & { body: Phaser.Physics.Arcade.Body };

    constructor() {
        super(sceneConfig);
    }

    public update() {
        // TODO
    }
}

export function setupGame(): Phaser.Game {
    const game = new Phaser.Game(gameConfig);
    return game;
}
