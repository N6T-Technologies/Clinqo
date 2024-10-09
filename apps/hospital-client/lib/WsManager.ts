import { IncomingMessage } from "clinqo-ws/incoming";

export const WS_BASE_URL = "ws://localhost:8000";

export class WsManger {
    private static instance: WsManger;

    private ws: WebSocket;
    private bufferedMessages: any[] = [];
    private callbacks: any = {};
    private id: number;
    private initialized: boolean = false;

    private constructor() {
        this.ws = new WebSocket(WS_BASE_URL);
        this.bufferedMessages = [];
        this.id = 1;
        this.init();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new WsManger();
        }

        return this.instance;
    }

    public init() {
        this.ws.onopen = () => {
            this.initialized = true;
            if (this.bufferedMessages) {
                this.bufferedMessages.forEach((message) => {
                    this.ws.send(JSON.stringify(message));
                });
                this.bufferedMessages = [];
            }
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const stream = message.stream.split("@")[0];
            const data = message.data;

            if (this.callbacks[stream]) {
                this.callbacks[stream].forEach(({ callback }) => {
                    //TODO: Can we convert below if checks in to swith case
                    if (stream === "depth") {
                        callback(data.depth);
                    }
                    if (stream === "new") {
                        callback(data.reshipi);
                    }
                    if (stream === "new_clinic") {
                        callback(data.reshipi);
                    }
                    if (stream === "ongoing") {
                        callback(data.currentReshipi);
                    }
                    if (stream === "cancellation") {
                        callback(data.reshipi);
                    }
                    if (stream === "completed") {
                        callback(data.reshipi);
                    }
                    if (stream === "current") {
                        callback(data.currentNumber);
                    }
                    if (stream === "total") {
                        callback(data.totalNumber);
                    }
                    if (stream === "number") {
                        callback(data.newNumber);
                    }
                    if (stream === "doctors") {
                        callback(data.availableDoctors);
                    }
                });
            }
        };
    }

    public sendMessage(message: Omit<IncomingMessage, "id">) {
        const messageToSend = {
            ...message,
            id: this.id++,
        };
        if (!this.initialized) {
            this.bufferedMessages.push(messageToSend);
        } else {
            this.ws.send(JSON.stringify(messageToSend));
        }
    }

    public async registerCallback(type: string, callback: any, id: string) {
        this.callbacks[type] = this.callbacks[type] || [];
        //"depth" => callback
        this.callbacks[type].push({ callback, id });

        console.log(this.callbacks);
    }

    public async deRegisterCallback(type: string, id: string) {
        if (this.callbacks[type]) {
            const index = this.callbacks[type].findIndex((callback) => callback.id === id);
            if (index !== -1) {
                this.callbacks[type].splice(index, 1);
            }
        }
    }
}
