import fs from "fs";
import { ReshipiBook } from "./Reshipies";

export class Shefu {
    private static instance: Shefu;

    private reshipieBooks: ReshipiBook[] = [];

    private constructor() {
        let snapshot = null;

        try {
            if (process.env.WITH_SNAPSHOT) {
                snapshot = fs.readFileSync("./snapshot.json");
            }
        } catch (e) {
            console.log("No snapshot found");
        }

        if (snapshot) {
            const snapshotObject = JSON.parse(snapshot.toString());
            this.reshipieBooks = snapshotObject.reshipieBooks.map(
                (r: any) =>
                    new ReshipiBook(r.clinic, r.doctor, r.reshipies, r.lastReshipiNumber, r.currentReshipiNumber)
            );
        } else {
            this.reshipieBooks = [new ReshipiBook("Some_Clinic", "Some_Doctor", [], 0, 0)];
        }

        setInterval(() => {
            this.saveSnapshot();
        }, 1000 * 3);
    }

    private saveSnapshot() {
        const snapshotObject = {
            reshipieBooks: this.reshipieBooks.map((r) => r.getSnapshot()),
        };

        fs.writeFileSync("./snapshot.json", JSON.stringify(snapshotObject));
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Shefu();
        }

        return this.instance;
    }

    public process(msg: unknown) {
        console.log(msg);
    }
}
