import { WebSocket } from "ws";

export class User {
    private id: string;
    private userSocket: WebSocket;

    constructor(id: string, userSocket: WebSocket) {
        this.id = id;
        this.userSocket = userSocket;
        this.addListeners();
    }

    private addListeners() {
        this.userSocket.on("message", (message: string) => {
            const parsedMessage = JSON.parse(message);
            console.log(`User with id ${this.id} sent message ${parsedMessage}`);
        });
    }
}
