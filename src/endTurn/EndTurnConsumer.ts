import { EndTurnMessagePayload } from "./EndTurnMessagePayload";
import { Consumer } from "../messageBus/consumer";
import { SimulationState } from "../game/SimulationState";
import { ToastPayload } from "../toast/ToastPayload";

export class EndTurnConsumer implements Consumer<EndTurnMessagePayload> {

    static readonly messageType = "endTurn";
    private turnMessage: Phaser.GameObjects.Text;
    private readonly turnMessageY = 100;

    fetchMessageType(): string {
        return EndTurnConsumer.messageType;
    }

    consume(simulationScene: SimulationState, payload: EndTurnMessagePayload): void {


        // get next team
        const nextTeam = simulationScene.fetchNextTeam();
        if (!nextTeam) {
            // TODO: current team has won
            simulationScene.messageRegister.registerMessage(ToastPayload.createToast(`${simulationScene.selectedLizard.team.name} wins!`));
            this.updateTurnMessage(simulationScene, `${simulationScene.selectedLizard.team.name} wins!`, simulationScene.selectedLizard.team.colour);
        }
        else {
            const nextCombatant = nextTeam.fetchNextCombatant();
            if (!nextCombatant) {
                // TODO: this eventually really shouldn't happen
            }
            else {
                simulationScene.selectedLizard = nextCombatant;
                simulationScene.messageRegister.registerMessage(ToastPayload.createToast(`${nextCombatant.team.name}, ${nextCombatant.name}'s turn!`));

                this.updateTurnMessage(simulationScene, `${nextCombatant.team.name}, ${nextCombatant.name}'s turn!`, nextCombatant.team.colour);
            }
        }
    }

    private updateTurnMessage(simulationScene: SimulationState, message: string, colour: string) {
        if (!this.turnMessage) {
            this.turnMessage = simulationScene.uiScene.add.text(0, this.turnMessageY, "");
        }

        this.turnMessage.text = message;
        this.turnMessage.setColor(colour);

        // center horizontally in screen
        const x = (simulationScene.uiScene.cameras.main.width / 2) -(this.turnMessage.displayWidth / 2);
        this.turnMessage.x = x;
    }

}
