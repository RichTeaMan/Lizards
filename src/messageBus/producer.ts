import { SimulationScene } from "../game/simulationScene";
import { KeyEvent } from "./KeyEvent";
import { PointerState } from "./PointerState";
import { MessagePayload } from "./MessagePayload";

export interface Producer {

    produce(
        simulationScene: SimulationScene,
        keyEvents: KeyEvent[],
        cursors: Phaser.Types.Input.Keyboard.CursorKeys,
        pointerState: PointerState): MessagePayload[];
}
