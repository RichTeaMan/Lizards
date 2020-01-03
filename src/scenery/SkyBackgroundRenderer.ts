import { BackgroundRenderer } from "./BackgroundRenderer";
import { SimulationScene } from "../game/simulationScene";

export class SkyBackgroundRenderer implements BackgroundRenderer {
    render(simulationScene: SimulationScene): void {
        
        simulationScene.scene.cameras.main.setBackgroundColor("#87ceeb");
    }

}