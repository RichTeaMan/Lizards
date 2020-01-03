import { Consumer } from "../messageBus/consumer";
import { SimulationState } from "../game/SimulationState";
import { ToastPayload } from "./ToastPayload";

export class ToastConsumer implements Consumer<ToastPayload> {

    private startX = 850;
    private startY = 50;
    private spacingY = 30;
    toasts: Phaser.GameObjects.Text[] = [];

    fetchMessageType(): string {
        return "toast";
    }

    consume(simulationScene: SimulationState, payload: ToastPayload): void {

        const toast = simulationScene.uiScene.add.text(this.startX, this.startY + (this.toasts.length * this.spacingY), payload.toastMessage);
        this.toasts.push(toast);

        simulationScene.uiScene.time.delayedCall(
            payload.durationMilliseconds,
            () => { 
                this.toasts = this.toasts.filter(t => t !== toast);
                toast.destroy();
                this.updateToasts();
            },
            null,
            null);
    }

    updateToasts() {
        for(let i = 0; i < this.toasts.length; i++) {
            const toast = this.toasts[i];
            toast.y = this.startY + (i * this.spacingY);
        }
    }

}
