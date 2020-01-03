import { BackgroundRenderer } from "./BackgroundRenderer";
import { SimulationState } from "../game/SimulationState";

export class SkyBackgroundRenderer implements BackgroundRenderer {
    render(simulationScene: SimulationState): void {
        
        simulationScene.gameScene.cameras.main.setBackgroundColor("#87ceeb");
    }

}