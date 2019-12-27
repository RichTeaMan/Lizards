import { Producer } from "./producer";
import { SimulationScene } from "../game/simulationScene";
import { Message } from "./message";
import { Consumer } from "./consumer";
import { KeyEvent } from "./KeyEvent";
import { PointerState } from "./PointerState";

export class MessageBus {

    private producers: Array<Producer<unknown>> = [];
    private consumers: Record<string, Consumer<unknown>> = {};
    private messages: Array<Message<unknown>> = [];

    registerProducer(producer: Producer<unknown>): MessageBus {

        this.producers.push(producer);
        return this;
    }

    registerConsumer(consumer: Consumer<unknown>): MessageBus {

        this.consumers[consumer.fetchMessageType()] = consumer;
        return this;
    }

    processProducers(
        simulationScene: SimulationScene,
        keyEvents: KeyEvent[],
        cursors: Phaser.Types.Input.Keyboard.CursorKeys,
        pointerState: PointerState): MessageBus {

        this.producers.forEach(producer => {
            try {
                const payload = producer.produce(simulationScene, keyEvents, cursors, pointerState);
                if (payload) {
                    const messageType = producer.fetchMessageType();
                    const message = new Message(messageType, payload);
                    this.messages.push(message);
                }
            }
            catch (error) {
                console.log(`Unable to process producer: ${error}.`);
            }
        });

        return this;
    }

    processConsumers(simulationScene: SimulationScene): MessageBus {

        this.messages.forEach(message => {

            if (message) {
                const consumer = this.consumers[message.messageType];
                consumer.consume(simulationScene, message.payload);
            }
        });
        this.messages = [];
        return this;
    }
}