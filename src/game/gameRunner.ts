import * as Phaser from 'phaser';
import { SimulationScene } from './simulationScene';

let simulationScene: SimulationScene;

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Sample',

    type: Phaser.AUTO,

    parent: "game-container",
    width: 1000,
    height: 1000,

    /*
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    */
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
    scene.load.image("background", simulationScene.background);
}

function create() {

    render(this as Phaser.Scene);

    //graphics.fillRect(0, 0, 1000, 1000);

    /*scene.tweens.add({
        targets: logo,
        y: 450,
        duration: 2000,
        ease: "Power2",
        yoyo: true,
        loop: -1
    });*/
}

function render(scene: Phaser.Scene) {

    const logo = scene.add.image(0, 0, "background");

    logo.scaleY = (logo.height * 2) / Number(gameConfig.height);
    logo.scaleX = (logo.width * 2) / Number(gameConfig.width);

    var graphics = scene.add.graphics();
    graphics.setDefaultStyles({
        lineStyle: {
            width: 1,
            color: 0xffffff,
            alpha: 1
        },
        fillStyle: {
            color: 0xffffff,
            alpha: 1
        }
    });
    //graphics.clear();



    simulationScene.destructibleTerrain.forEach(element => {
        const renderSquare = element.calculateRenderSquare();
        graphics.fillRect(renderSquare.x, renderSquare.y, renderSquare.width, renderSquare.height);
    });
}

/**
 * This method is called once per game step while the scene is running.
 * 
 * @param time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
function update(time: number, delta: number) {

    const scene = this as Phaser.Scene;

    if (scene.game.input.activePointer.isDown) {
        console.log(`${scene.game.input.activePointer.x}, ${scene.game.input.activePointer.y}`);

        // resolve tile
        const removedTerrain = simulationScene.removeTerrain(
            scene.game.input.activePointer.x / simulationScene.terrainPieceSize,
            scene.game.input.activePointer.y / simulationScene.terrainPieceSize);
        if (removedTerrain) {
            console.log("Removed");

            render(scene);
        }
        else {
            console.log("Nothing");
        }
        console.log(simulationScene.destructibleTerrain.length);

    }

    simulationScene.destructibleTerrain.forEach(element => {
        //graphics.strokeRect(element.x, element.y, simulationScene.terrainPieceSize, simulationScene.terrainPieceSize);
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
