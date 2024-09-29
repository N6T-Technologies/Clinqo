import { createClient } from "redis";
import { Shefu } from "./state/Shefu";

async function main() {
    const redisClient = createClient();
    redisClient.connect();
    console.log("Connected to redis");

    while (true) {
        const message = await redisClient.rPop("message" as string);

        if (!message) {
        } else {
            Shefu.getInstance().process(message);
        }
    }
}

main();
