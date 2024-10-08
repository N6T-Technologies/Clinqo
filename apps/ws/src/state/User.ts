import { WebSocket } from "ws";
import { IncomingMessage, SUBSCRIBE, UNSUBSCRIBE } from "../types/incoming";
import { SubscriptionManager } from "./SubscriptionManager";
import { OutgoingMessages } from "../types/outgoing";

export class User {
    private id: string;
    private userSocket: WebSocket;
    private subscriptions: string[] = [];

    constructor(id: string, userSocket: WebSocket) {
        this.id = id;
        this.userSocket = userSocket;
        this.addListeners();
    }

    public subscribe(channel: string) {
        this.subscriptions.push(channel);
    }

    public unsubscribe(channel: string) {
        this.subscriptions.filter((c) => c != channel);
    }

    public sendMessage(message: OutgoingMessages) {
        this.userSocket.send(JSON.stringify(message));
    }

    private addListeners() {
        this.userSocket.on("message", (message: string) => {
            const parsedMessage: IncomingMessage = JSON.parse(message); //type of parsed message should be Incoming message

            if (parsedMessage.method === SUBSCRIBE) {
                parsedMessage.params.forEach((c) => SubscriptionManager.getInstance().subscribe(this.id, c));
            } else if (parsedMessage.method === UNSUBSCRIBE) {
                parsedMessage.params.forEach((c) => SubscriptionManager.getInstance().unsubscribe(this.id, c));
            }
        });
    }
}
