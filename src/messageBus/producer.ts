import { SimulationState } from "../game/SimulationState";
import { KeyEvent } from "./KeyEvent";
import { PointerState } from "./PointerState";
import { MessagePayload } from "./MessagePayload";

export interface Producer {

    produce(
        simulationScene: SimulationState,
        keyEvents: KeyEvent[],
        cursors: Phaser.Types.Input.Keyboard.CursorKeys,
        pointerState: PointerState): MessagePayload[];
}
