import { SimulationState } from "./SimulationState";
import { WeaponChoiceScreen } from "../ui/WeaponChoiceScreen";
import { BazookaProducer } from "../weapons/bazooka/BazookaProducer";
import { ShotgunProducer } from "../weapons/shotgun/ShotgunProducer";

export class UiScene extends Phaser.Scene {

    private weaponChoiceScreen: WeaponChoiceScreen = null;
    private selectedWeaponText: Phaser.GameObjects.Text = null;
    private fpsCountText: Phaser.GameObjects.Text = null;

    constructor() {
        super({ key: 'UIScene', active: true });
    }

    public preload() {
        SimulationState.current().uiScene = this;
        this.selectedWeaponText = this.add.text(20, this.cameras.main.height - 60, "");
        this.fpsCountText = this.add.text(5, 5, "- fps");
    }

    public create() {
        const weaponChoices = [new BazookaProducer(), new ShotgunProducer()];
        this.weaponChoiceScreen = new WeaponChoiceScreen().initialise(this, weaponChoices);
        SimulationState.current().updateSelectedWeapon(weaponChoices[0]);

        this.updateSelectedWeaponRender();
        this.weaponChoiceScreen.visible(false);

        const uiScene = this;
        this.input.keyboard.on('keydown', function (event: KeyboardEvent) {
            if (event.code === "Tab") {
                uiScene.weaponChoiceScreen.visible(!uiScene.weaponChoiceScreen.isVisible());
                event.preventDefault();
            }
        });
    }

    public render(scene: Phaser.Scene) {

    }

    public updateSelectedWeaponRender() {
        this.selectedWeaponText.text = `Selected weapon: ${SimulationState.current().selectedWeapon.name}`;
    }

    /**
     * This method is called once per game step while the scene is running.
     * 
     * @param time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
     * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
     */
    public update(time: number, delta: number) {
        this.fpsCountText.text = `${this.game.loop.actualFps.toFixed(2)} fps`;
    }
}