import { WebSocket } from "ws";
import { User } from "./User";

export class UserManager {
    private static instance: UserManager;
    private usersMap: Map<string, User> = new Map();

    private constructor() {}

    public static getInstance() {
        if (!this.instance) {
            this.instance = new UserManager();
        }

        return this.instance;
    }

    public addUser(userSocket: WebSocket) {
        const id = this.getRandomId();
        const user = new User(id, userSocket);
        this.usersMap.set(id, user);
        this.registerOnClose(id, userSocket);
        console.log(`user with id ${id} added to user manager`);
        return user;
    }

    public registerOnClose(id: string, userSocket: WebSocket) {
        userSocket.on("close", () => {
            this.usersMap.delete(id);
            console.log(`user with id ${id} left`);
        });
    }

    public getUser(id: string) {
        return this.usersMap.get(id);
    }

    private getRandomId() {
        let S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };

        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    }
}
