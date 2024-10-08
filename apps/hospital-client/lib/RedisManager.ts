import { RedisClientType, createClient } from "redis";
import { MessageFromEngine } from "@/types/fromEngine";
import { MessageToEngine } from "@/types/toEngine";

export class RedisManger {
    private static instance: RedisManger;

    private publishClient: RedisClientType;
    private subscribeClient: RedisClientType;

    private constructor() {
        this.publishClient = createClient();
        this.publishClient.connect();

        this.subscribeClient = createClient();
        this.subscribeClient.connect();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManger();
        }

        return this.instance;
    }

    public sendAndAwait(message: MessageToEngine) {
        return new Promise<MessageFromEngine>((resolve) => {
            const id = this.getRandomClientId();
            this.subscribeClient.subscribe(id, (message) => {
                this.subscribeClient.unsubscribe(id);
                resolve(JSON.parse(message));
            });

            this.publishClient.lPush("messages", JSON.stringify({ message: message, clientId: id }));
        });
    }

    public getRandomClientId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
