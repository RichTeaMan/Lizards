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
import { TerrainPiece } from './terrainPiece';
import { ToastConsumer } from '../toast/ToastConsumer';
import { Team } from '../Team';
import { EndTurnConsumer } from '../endTurn/EndTurnConsumer';
import { EndTurnMessagePayload } from '../endTurn/EndTurnMessagePayload';
import { BackgroundRenderer } from '../scenery/BackgroundRenderer';
import { SkyBackgroundRenderer } from '../scenery/SkyBackgroundRenderer';

let simulationScene: SimulationScene;
let messageBus: MessageBus;
let keyEvents: KeyEvent[] = [];
let dragMode: boolean = false;
let lastDragPosition = { x: 0, y: 0 };
let backgroundRenderer: BackgroundRenderer;

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Lizards',

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
    messageBus.registerConsumer(new ToastConsumer());
    messageBus.registerConsumer(new EndTurnConsumer());
    const scene = this as Phaser.Scene;
    simulationScene = new SimulationScene(scene, messageBus);
    scene.load.image("foreground", `assets/${simulationScene.foreground}`);
    scene.load.image("lizard", "assets/lizard.png");
    scene.load.image("smoke", "assets/white-smoke.png");
    scene.load.image("yellow", "assets/yellow.png");
    scene.load.image("bazookaRocket", "assets/bazookaRocket.png");

    //scene.cameras.main.x = -simulationScene.renderOffsetX;
    //scene.cameras.main.y = -simulationScene.renderOffsetY;

    scene.cameras.main.setViewport(0, 0, 1000, 1000);
}

function create() {

    const scene = this as Phaser.Scene;

    backgroundRenderer = new SkyBackgroundRenderer();

    render(scene);

    const team1 = new Team();
    team1.name = "Team 1";
    const team2 = new Team();
    team2.name = "Team 2";

    simulationScene.teams.push(team1);
    simulationScene.teams.push(team2);

    simulationScene.lizards.push(new Combatant().initialise(scene, 100, 200, team1));
    simulationScene.lizards.push(new Combatant().initialise(scene, 200, 400, team1));
    simulationScene.lizards.push(new Combatant().initialise(scene, 325, 350, team1));
    simulationScene.lizards.push(new Combatant().initialise(scene, 465, 100, team2));
    simulationScene.lizards.push(new Combatant().initialise(scene, 700, 320, team2));
    simulationScene.lizards.push(new Combatant().initialise(scene, 815, 360, team2));

    simulationScene.lizards.forEach(l => {
        l.sprite.scale = 0.1;
        l.sprite.setBounce(0.1).setCollideWorldBounds(true);
    });

    simulationScene.selectedLizard = simulationScene.lizards[0];

    for (let i = 0; i < simulationScene.width; i++) {
        for (let j = simulationScene.height / 2; j < simulationScene.height; j++) {

            const terrain = new TerrainPiece(simulationScene, i, j);
            simulationScene.destructibleTerrain.push(terrain);
        }
    }

    scene.physics.world.on('collide', (body: Phaser.Physics.Impact.Body, other: Phaser.Physics.Impact.Body, axis: string) => {

        const p1 = simulationScene.fetchProjectile(body);
        const p2 = simulationScene.fetchProjectile(other);
        const projectile = p1 ? p1 : p2;

        if (projectile) {

            const l1 = simulationScene.fetchCombatant(body);
            const l2 = simulationScene.fetchCombatant(other);
            const combatant = l1 ? l1 : l2;

            if (combatant) {
                projectile.onCombatantCollision(combatant, simulationScene);
            }
            else {
                const dt1 = simulationScene.fetchTerrainFromBody(body);
                const dt2 = simulationScene.fetchTerrainFromBody(body);
                const destructibleTerrain = dt1 ? dt1 : dt2;

                if (destructibleTerrain) {
                    projectile.onTerrainCollision(destructibleTerrain, simulationScene);
                }
            }
        }

    });

    scene.input.keyboard.on('keydown', function (event: KeyboardEvent) {
        keyEvents.push(new KeyEvent(event.code, State.DOWN, event.ctrlKey, event.shiftKey));
    });
    scene.input.keyboard.on('keyup', function (event: KeyboardEvent) {
        keyEvents.push(new KeyEvent(event.code, State.UP, event.ctrlKey, event.shiftKey))
    });

    scene.input.on('pointerdown', function (pointer: Phaser.Input.Pointer) {
        if (pointer.middleButtonDown()) {
            dragMode = true;
            lastDragPosition.x = pointer.x;
            lastDragPosition.y = pointer.y;
        }
    });

    scene.input.on('pointerup', function (pointer: Phaser.Input.Pointer) {
        if (pointer.middleButtonReleased()) {
            dragMode = false;
        }
    });

    scene.input.on('wheel', function (pointer, currentlyOver, dx, dy: number, dz, event) {

        const zoomDelta = 0.2;
        if (dy < 0) {
            scene.cameras.main.zoom += zoomDelta;
        }
        else {
            scene.cameras.main.zoom -= zoomDelta;
        }
        if (scene.cameras.main.zoom < 0.2) {
            scene.cameras.main.zoom = 0.2;
        }
        else if (scene.cameras.main.zoom > 4) {
            scene.cameras.main.zoom = 4;
        }

    });

    // initiate turn machinery
    messageBus.registerMessage(new EndTurnMessagePayload());

}

function render(scene: Phaser.Scene) {

    backgroundRenderer.render(simulationScene);
}

/**
 * This method is called once per game step while the scene is running.
 * 
 * @param time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
function update(time: number, delta: number) {

    const scene = this as Phaser.Scene;

    simulationScene.destructibleTerrain.forEach(s => {
        simulationScene.lizards.forEach(l => {
            scene.physics.world.collide(s.sprite, l.sprite);
        });

        simulationScene.projectiles.forEach(p => {
            scene.physics.world.collide(s.sprite, p.sprite);
        });
    });

    simulationScene.lizards.forEach(l => {
        simulationScene.projectiles.forEach(p => {
            scene.physics.world.collide(l.sprite, p.sprite);
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
        l.update(simulationScene);
    });

    simulationScene.projectiles.forEach(p => {
        p.update(scene);
    })

    simulationScene.projectiles = simulationScene.projectiles.filter(p => !p.exploded);

    if (dragMode) {
        const pointer = scene.input.activePointer;
        const deltaX = pointer.x - lastDragPosition.x;
        const deltaY = pointer.y - lastDragPosition.y;
        //scene.cameras.main.x += deltaX;
        //scene.cameras.main.y += deltaY;

        scene.cameras.main.setScroll(scene.cameras.main.scrollX - deltaX, scene.cameras.main.scrollY - deltaY);

        if (scene.cameras.main.x < 0) {
            scene.cameras.main.x = 0;
        }
        if (scene.cameras.main.y < 0) {
            scene.cameras.main.y = 0;
        }

        console.log(`${scene.cameras.main.x}, ${scene.cameras.main.y} - ${scene.cameras.main.width}`);

        lastDragPosition.x = pointer.x;
        lastDragPosition.y = pointer.y;
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
