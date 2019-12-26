import { SimulationScene } from "../game/simulationScene";

export interface Producer<T> {

    fetchMessageType(): string;

    produce(
        simulationScene: SimulationScene,
        event: KeyboardEvent,
        cursors: Phaser.Types.Input.Keyboard.CursorKeys): T;
}