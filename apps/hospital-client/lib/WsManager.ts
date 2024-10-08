import { OutgoingMessages } from "clinqo-ws/outgoing";

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
            this.bufferedMessages.forEach((message) => {
                this.ws.send(JSON.stringify(message));
            });
            this.bufferedMessages = [];
        };

        this.ws.onmessage = (event: OutgoingMessages) => {
            const message = JSON.parse(event);
            const stream = message.stream.split("@")[0];
            const data = message.data;

            if (this.callbacks[stream]) {
                this.callbacks[stream].forEach(({ callback }) => {
                    //TODO: Can we convert below if checks in to swith case
                    if (stream === "depth") {
                        callback(data.reshipies);
                    }
                    if (stream === "new") {
                        callback(data.depth);
                    }
                    if (stream === "total") {
                        callback(data.totalNumber);
                    }
                    if (stream === "number") {
                        callback(data.newNumber);
                    }
                    if (stream === "ongoing") {
                        callback(data.number);
                    }
                    if (stream === "doctors") {
                        callback(data.availableDoctors);
                    }
                });
            }
        };
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
