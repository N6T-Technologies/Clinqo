export class Shefu {
    private static instance: Shefu;

    private constructor() {}

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
