import { createClient, RedisClientType } from "redis";
import { MessageToApi } from "./types/toApi";

export class RedisManager {
    private static instance: RedisManager;
    private client: RedisClientType;

    private constructor() {
        this.client = createClient();
        this.client.connect();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }

        return this.instance;
    }

    //TODO: Create DbMessage Type and replace unknown
    public pushMessageToDb(message: unknown) {
        this.client.lPush("db_processor", JSON.stringify(message));
    }

    //TODO: Create WsMessage Type and replace unknown
    public publishMessageToWs(channel: string, message: unknown) {
        this.client.publish(channel, JSON.stringify(message));
    }

    public sendToApi(clientId: string, message: MessageToApi) {
        this.client.publish(clientId, JSON.stringify(message));
    }
}
