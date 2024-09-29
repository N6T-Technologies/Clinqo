import { createClient, RedisClientType } from "redis";
import { UserManager } from "./UserManager";

export class SubscriptionManager {
    private static instance: SubscriptionManager;
    private redisClient: RedisClientType;

    private subscriptions: Map<string, string[]> = new Map(); //<userId, [stream1, stream2]>
    private reverseSubscriptions: Map<string, string[]> = new Map(); //<stream1, [userId1, userId2]>

    private constructor() {
        this.redisClient = createClient();
        this.redisClient.connect();
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new SubscriptionManager();
        }

        return this.instance;
    }

    public subscribe(userId: string, channel: string) {
        if (this.subscriptions.get(userId)?.includes(channel)) {
            return;
        }

        const currentSubscription = this.subscriptions.get(userId) || [];
        this.subscriptions.set(userId, currentSubscription.concat(channel));

        UserManager.getInstance().getUser(userId)?.subscribe(channel);

        const currentReverseSubscription = this.reverseSubscriptions.get(channel) || [];
        this.reverseSubscriptions.set(channel, currentReverseSubscription.concat(userId));

        if (this.reverseSubscriptions.get(channel)?.length === 1) {
            this.redisClient.subscribe(channel, this.redisCallbackHandler);
        }
    }

    //redisCallbackHandler: Sends message to every user which is on the channel
    //Using arrow function here is essential or else we'll get error
    //Make question out of this
    private redisCallbackHandler = (message: string, channel: string) => {
        const parsedMessage = JSON.parse(message);

        this.reverseSubscriptions
            .get(channel)
            ?.forEach((userId) => UserManager.getInstance().getUser(userId)?.sendMessage(parsedMessage));
    };

    public unsubscribe(userId: string, channel: string) {
        const currentSubscriptions = this.subscriptions.get(userId);

        if (currentSubscriptions) {
            const newSubscribtions = currentSubscriptions.filter((c) => c != channel);
            this.subscriptions.set(userId, newSubscribtions || []);

            UserManager.getInstance().getUser(userId)?.unsubscribe(channel);
        }

        const reverseSubscriptions = this.reverseSubscriptions.get(channel);

        if (reverseSubscriptions) {
            const newReverseSubscriptions = reverseSubscriptions.filter((u) => u != userId);
            this.reverseSubscriptions.set(channel, newReverseSubscriptions);

            if (this.reverseSubscriptions.get(channel)?.length === 0) {
                this.reverseSubscriptions.delete(channel);
                this.redisClient.unsubscribe(channel);
            }
        }
    }

    //We need this userLeft function because when user leaves the ws server we want to unsubscribe him from all his subscriptions
    public userLeft(userId: string) {
        console.log(`user with id ${userId} left`);
        this.subscriptions.get(userId)?.forEach((c) => this.unsubscribe(userId, c));
    }

    public getSubscriptions(userId: string) {
        return this.subscriptions.get(userId) || [];
    }
}
