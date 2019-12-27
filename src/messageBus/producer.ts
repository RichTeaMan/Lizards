import { SimulationScene } from "../game/simulationScene";
import { KeyEvent } from "./KeyEvent";
import { PointerState } from "./PointerState";

export interface Producer<T> {

    fetchMessageType(): string;

    produce(
        simulationScene: SimulationScene,
        keyEvents: KeyEvent[],
        cursors: Phaser.Types.Input.Keyboard.CursorKeys,
        pointerState: PointerState): T;
}
