import { SimulationState } from "./SimulationState";

export class UiScene extends Phaser.Scene {

    constructor() {
        super({ key: 'UIScene', active: true });
    }

    public preload() {
        SimulationState.current().uiScene = this;
    }

    public create() {

    }

    public render(scene: Phaser.Scene) {

    }

    /**
     * This method is called once per game step while the scene is running.
     * 
     * @param time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    public update(time: number, delta: number) {

    }
}