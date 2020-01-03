import { EndTurnMessagePayload } from "./EndTurnMessagePayload";
import { Consumer } from "../messageBus/consumer";
import { SimulationState } from "../game/SimulationState";
import { ToastPayload } from "../toast/ToastPayload";

export class EndTurnConsumer implements Consumer<EndTurnMessagePayload> {

    static readonly messageType = "endTurn";

    fetchMessageType(): string {
        return EndTurnConsumer.messageType;
    }

    consume(simulationScene: SimulationState, payload: EndTurnMessagePayload): void {

        // get next team
        const nextTeam = simulationScene.fetchNextTeam();
        if (!nextTeam) {
            // TODO: current team has won
            simulationScene.messageRegister.registerMessage(ToastPayload.createToast(`${simulationScene.selectedLizard.team.name} wins!`));
        }
        else {
            const nextCombatant = nextTeam.fetchNextCombatant();
            if (!nextCombatant) {
                // TODO: this eventually really shouldn't happen
            }
            else {
                simulationScene.selectedLizard = nextCombatant;
                simulationScene.messageRegister.registerMessage(ToastPayload.createToast(`${nextCombatant.team.name}, ${nextCombatant.name}'s turn!`));
            }
        }
    }

}
