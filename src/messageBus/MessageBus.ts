import { Producer } from "./Producer";
import { SimulationState } from "../game/SimulationState";
import { Message } from "./Message";
import { Consumer } from "./Consumer";
import { KeyEvent } from "./KeyEvent";
import { PointerState } from "./PointerState";
import { MessagePayload } from "./MessagePayload";
import { MessageRegister } from "./MessageRegister";

export class MessageBus implements MessageRegister {

    private selectedWeaponProducer: Producer = null;
    private producers: Array<Producer> = [];
    private consumers: Record<string, Consumer<unknown>> = {};
    private messages: Array<Message<MessagePayload>> = [];

    changeWeaponProducer(producer: Producer): MessageBus {
        this.selectedWeaponProducer = producer;
        return this;
    }

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
        simulationScene: SimulationState,
        keyEvents: KeyEvent[],
        cursors: Phaser.Types.Input.Keyboard.CursorKeys,
        pointerState: PointerState): MessageBus {

        if (this.selectedWeaponProducer) {
            try {
                const payloads = this.selectedWeaponProducer.produce(simulationScene, keyEvents, cursors, pointerState);
                if (payloads) {
                    payloads.forEach(p => {
                        this.registerMessage(p);
                    });
                }
            }
            catch (error) {
                console.log(`Unable to process selected weapon producer: ${error}.`);
            }
        }

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

    processConsumers(simulationScene: SimulationState): MessageBus {

        // the message queue needs to be cleared, but consumers may wish to add their own messages,
        // so backup the buffer and then clear.
        const currentMessages = this.messages;
        this.messages = [];
        currentMessages.forEach(message => {

            if (message) {
                const consumer = this.consumers[message.getType()];
                if (consumer) {

                    consumer.consume(simulationScene, message.payload);
                }
                else {
                    console.error(`Consumer for message not found! Message type: ${message.getType()}`);
                }
            }
        });
        return this;
    }
}