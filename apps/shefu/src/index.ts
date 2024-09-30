import { createClient } from "redis";
import { Shefu } from "./state/Shefu";

async function main() {
    const redisClient = createClient();
    try {
        redisClient.connect();
        console.log("Connected to redis");
    } catch (e) {
        throw Error("Could not connect to redis");
    }

    while (true) {
        const message = await redisClient.rPop("messages" as string);

        if (!message) {
        } else {
            Shefu.getInstance().process(JSON.parse(message));
        }
    }
}

main();
