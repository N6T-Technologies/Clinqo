import { WebSocketServer } from "ws";
import { UserManager } from "./state/UserManager";

const PORT: number = 8000;

const wss = new WebSocketServer({ port: PORT }, () => {
    console.log(`WS server running on port ${PORT}...`);
});

wss.on("connection", (userSocket) => {
    const user = UserManager.getInstance().addUser(userSocket);
});
