import { Producer } from "./producer";
import { SimulationScene } from "../game/simulationScene";
import { Message } from "./message";
import { Consumer } from "./consumer";
import { KeyEvent } from "./KeyEvent";
import { PointerState } from "./PointerState";
import { MessagePayload } from "./MessagePayload";
import { MessageRegister } from "./MessageRegister";

export class MessageBus implements MessageRegister {


    private producers: Array<Producer> = [];
    private consumers: Record<string, Consumer<unknown>> = {};
    private messages: Array<Message<MessagePayload>> = [];

    registerProducer(producer: Producer): MessageBus {

        this.producers.push(producer);
        return this;
    }

    registerConsumer(consumer: Consumer<unknown>): MessageBus {

        this.consumers[consumer.fetchMessageType()] = consumer;
        return this;
    }

    registerMessage(messagePayload: MessagePayload) {
        this.messages.push(new Message(messagePayload));
    }

    processProducers(
        simulationScene: SimulationScene,
        keyEvents: KeyEvent[],
        cursors: Phaser.Types.Input.Keyboard.CursorKeys,
        pointerState: PointerState): MessageBus {

        this.producers.forEach(producer => {
            try {
                const payloads = producer.produce(simulationScene, keyEvents, cursors, pointerState);
                if (payloads) {
                    payloads.forEach(p => {
                        this.registerMessage(p);
                    });
                }
            }
            catch (error) {
                console.log(`Unable to process producer: ${error}.`);
            }
        });

        return this;
    }

    processConsumers(simulationScene: SimulationScene): MessageBus {

        // the message queue needs to be cleared, but consumers may wish to add their own messages,
        // so backup the buffer and then clear.
        const currentMessages = this.messages;
        this.messages = [];
        currentMessages.forEach(message => {

            if (message) {
                const consumer = this.consumers[message.getType()];
                consumer.consume(simulationScene, message.payload);
            }
        });
        return this;
    }
}