import * as Phaser from 'phaser';
import { SimulationScene } from './simulationScene';
import { MessageBus } from '../messageBus/messageBus';
import { WalkProducer } from '../mobility/walkProducer';
import { WalkConsumer } from '../mobility/walkConsumer';
import { KeyEvent, State } from '../messageBus/KeyEvent';
import { PointerState } from '../messageBus/PointerState';
import { BazookaConsumer } from '../weapons/BazookaConsumer';
import { BazookaProducer } from '../weapons/BazookaProducer';
import { Combatant } from '../Combatant';

let simulationScene: SimulationScene;
let messageBus: MessageBus;
let keyEvents: KeyEvent[] = [];

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

    messageBus = new MessageBus();
    messageBus.registerProducer(new WalkProducer());
    messageBus.registerProducer(new BazookaProducer());
    messageBus.registerConsumer(new WalkConsumer());
    messageBus.registerConsumer(new BazookaConsumer());
    const scene = this as Phaser.Scene;
    simulationScene = new SimulationScene(scene);
    scene.load.image("background", `assets/${simulationScene.background}`);
    scene.load.image("foreground", `assets/${simulationScene.foreground}`);
    scene.load.image("lizard", "assets/lizard.png");
    scene.load.image("bazookaRocket", "assets/bazookaRocket.png");
}

function create() {

    const scene = this as Phaser.Scene;
    render(scene);

    simulationScene.lizards.push(new Combatant().initialise(scene, 100, 200));
    simulationScene.lizards.push(new Combatant().initialise(scene, 200, 400));
    simulationScene.lizards.push(new Combatant().initialise(scene, 325, 350));
    simulationScene.lizards.push(new Combatant().initialise(scene, 465, 100));
    simulationScene.lizards.push(new Combatant().initialise(scene, 700, 320));

    simulationScene.lizards.forEach(l => {
        l.sprite.scale = 0.1;
        l.sprite.setBounce(0.1).setCollideWorldBounds(true);
    });
    simulationScene.selectedLizard = simulationScene.lizards[0].sprite;

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

        simulationScene.terrainSprites.push(sprite);

        sprite.setInteractive().addListener('pointerdown', (pointer, localX, localY, event) => {
            simulationScene.removeTerrain(terrain);
        });

        scene.physics.world.on('collide', (body: Phaser.Physics.Impact.Body, other: Phaser.Physics.Impact.Body, axis: string) => {

            //body.destroy();
            //other.destroy();

            const l1 = simulationScene.fetchCombatant(body);
            const l2 = simulationScene.fetchCombatant(other);

            if (l1 || l2) {
                body.destroy();
                other.destroy();
            }

        });

        terrain.onDestroy = (t) => {
            sprite.destroy();
        };
    });

    scene.input.keyboard.on('keydown', function (event: KeyboardEvent) {
        keyEvents.push(new KeyEvent(event.code, State.DOWN, event.ctrlKey, event.shiftKey));
    });
    scene.input.keyboard.on('keyup', function (event: KeyboardEvent) {
        keyEvents.push(new KeyEvent(event.code, State.UP, event.ctrlKey, event.shiftKey))
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

    simulationScene.terrainSprites.forEach(s => {
        simulationScene.lizards.forEach(l => {
            scene.physics.world.collide(s, l.sprite);
        });

        simulationScene.projectiles.forEach(p => {
            scene.physics.world.collide(s, p);
        });
    });

    simulationScene.lizards.forEach(l => {
        simulationScene.projectiles.forEach(p => {
            scene.physics.world.collide(l.sprite, p);
        });
    });

    const cursors = scene.input.keyboard.createCursorKeys();

    const x = scene.input.activePointer.x;
    const y = scene.input.activePointer.y;
    const pointerState = new PointerState(x, y);

    messageBus.processProducers(simulationScene, keyEvents, cursors, pointerState);
    messageBus.processConsumers(simulationScene);

    keyEvents = [];


    simulationScene.lizards.forEach(l => {
        l.update(scene);
    });
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
