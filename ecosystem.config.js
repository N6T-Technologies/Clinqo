module.exports = {
    apps: [
        {
            name: "hospital-client",
            cwd: "./apps/hospital-client",
            script: "node_modules/next/dist/bin/next",
            args: "start",
        },
        {
            name: "shefu-service",
            cwd: "./apps/shefu",
            script: "./dist/index.js",
        },
        {
            name: "ws-service",
            cwd: "./apps/ws",
            script: "./dist/index.js",
        },
    ],
};
