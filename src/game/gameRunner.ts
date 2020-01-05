import * as Phaser from 'phaser';
import { SimulationState } from './SimulationState';
import { MessageBus } from '../messageBus/messageBus';
import { BazookaConsumer } from '../weapons/bazooka/BazookaConsumer';
import { BazookaProducer } from '../weapons/bazooka/BazookaProducer';
import { ToastConsumer } from '../toast/ToastConsumer';
import { EndTurnConsumer } from '../endTurn/EndTurnConsumer';
import { EndTurnMessagePayload } from '../endTurn/EndTurnMessagePayload';
import { WalkProducer } from '../mobility/walkProducer';
import { WalkConsumer } from '../mobility/walkConsumer';
import { GameScene } from './GameScene';
import { UiScene } from './UiScene';

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Lizards',
    type: Phaser.AUTO,
    parent: "game-container",
    width: 1000,
    height: 1000,
    scene: [GameScene, UiScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 200 }
        },
    },
    backgroundColor: '#000000',
};

export function setupGame(): Phaser.Game {

    const messageBus = SimulationState.current().messageRegister as MessageBus;
    messageBus.registerProducer(new WalkProducer())
        .registerWeaponProducer(new BazookaProducer())
        .registerConsumer(new WalkConsumer())
        .registerConsumer(new BazookaConsumer())
        .registerConsumer(new ToastConsumer())
        .registerConsumer(new EndTurnConsumer());

    const game = new Phaser.Game(gameConfig);

    messageBus.registerMessage(new EndTurnMessagePayload());

    return game;
}
