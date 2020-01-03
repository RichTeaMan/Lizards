import { Consumer } from "../messageBus/consumer";
import { SimulationState } from "../game/SimulationState";
import { ToastPayload } from "./ToastPayload";

export class ToastConsumer implements Consumer<ToastPayload> {

    private rightMargin = 50;
    private startY = 50;
    private spacingY = 30;
    toasts: Phaser.GameObjects.Text[] = [];

    fetchMessageType(): string {
        return "toast";
    }

    consume(simulationScene: SimulationState, payload: ToastPayload): void {

        const toast = simulationScene.uiScene.add.text(0, this.startY + (this.toasts.length * this.spacingY), payload.toastMessage);
        const startX = simulationScene.uiScene.cameras.main.width - (this.rightMargin + toast.width);
        toast.x = startX;
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
