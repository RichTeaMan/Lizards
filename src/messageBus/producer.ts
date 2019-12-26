import { Message } from "./message";
import { SimulationScene } from "../game/simulationScene";

export interface Producer<T> {

    produce(
        simulationScene: SimulationScene,
        event: KeyboardEvent,
        cursors: Phaser.Types.Input.Keyboard.CursorKeys): void | Message<T>;
}