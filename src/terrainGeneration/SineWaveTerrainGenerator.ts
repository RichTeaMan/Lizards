import { TerrainGenerator } from "./TerrainGenerator";
import { SimulationState } from "../game/SimulationState";
import { TerrainPiece } from "../game/TerrainPiece";

export class SineWaveTerrainGenerator implements TerrainGenerator {

    generate(simulationState: SimulationState): void {
        for (let i = 0; i < simulationState.width; i++) {

            const startHeight = Math.floor((Math.sin(i / (2 * Math.PI)) * 10) + simulationState.height / 2);

            for (let j = startHeight; j < (simulationState.height / 2) + 50; j++) {

                const terrain = new TerrainPiece(simulationState, i, j);
                simulationState.destructibleTerrain.push(terrain);
            }
        }
    }
}