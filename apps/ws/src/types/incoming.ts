export const SUBSCRIBE = "SUBSCRIBE";
export const UNSUBSCRIBE = "UNSUBSCRIBE";

export type SubscribeMessage = {
    method: typeof SUBSCRIBE;
    params: string[];
    id: number;
};

export type UnsubscribeMessage = {
    method: typeof UNSUBSCRIBE;
    params: string[];
    id: number;
};

export type IncomingMessage = SubscribeMessage | UnsubscribeMessage;
