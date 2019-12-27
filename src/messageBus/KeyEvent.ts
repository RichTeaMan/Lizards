export class KeyEvent {
    readonly code: string;
    readonly state: State;

    /**
     * Indicates whether the CTRL key was pressed during this event.
     */
    readonly ctrl: boolean;

    /**
     * Indicates whether the shift key was pressed during this event.
     */
    readonly shift: boolean;

    constructor(code: string, state: State, ctrl: boolean, shift: boolean) {
        this.code = code;
        this.state = state;
        this.ctrl = ctrl;
        this.shift = shift;
    }
}

export enum State {
    DOWN,
    UP
}
