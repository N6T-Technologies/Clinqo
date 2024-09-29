import { WebSocket } from "ws";

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

    public sendMessage(message: unknown) {
        //the type of message should be outgoing message
        this.userSocket.send(JSON.stringify(message));
    }

    private addListeners() {
        this.userSocket.on("message", (message: string) => {
            const parsedMessage = JSON.parse(message); //type of parsed message should be Incoming message
            console.log(`User with id ${this.id} sent message ${parsedMessage}`);
        });
    }
}
