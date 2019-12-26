import { Producer } from "./producer";
import { SimulationScene } from "../game/simulationScene";
import { Message } from "./message";
import { Consumer } from "./consumer";

export class MessageBus {

    private producers: Array<Producer<unknown>> = [];
    private consumers: Array<Consumer<unknown>> = [];
    private messages: Array<Message<unknown>> = [];

    registerProducer(producer: Producer<unknown>): MessageBus {

        this.producers.push(producer);
        return this;
    }

    registerConsumer(consumer: Consumer<unknown>): MessageBus {

        this.consumers.push(consumer);
        return this;
    }

    processProducers(
        simulationScene: SimulationScene,
        keyboardEvent: KeyboardEvent,
        cursors: Phaser.Types.Input.Keyboard.CursorKeys): MessageBus {

        this.producers.forEach(producer => {
            try {
                const message = producer.produce(simulationScene, keyboardEvent, cursors);
                if (message) {
                    this.messages.push(message);
                }
            }
            catch (error) {
                console.log(`Unable to process producer: ${error}`);
            }
        })

        return this;
    }

    processConsumers(simulationScene: SimulationScene): MessageBus {

        this.messages.forEach(message => {

            if (message) {
                // TODO: consumer determination.
                this.consumers.forEach(consumer => {
                    consumer.consume(simulationScene, message);
                });
            }
        });
        this.messages = [];
        return this;
    }
}