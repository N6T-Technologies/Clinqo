module.exports = {
    apps: [
        // {
        //     name: "redis-container",
        //     script: "docker",
        //     args: "run --rm -d -p 6379:6379 --name redis redis:latest",
        //     watch: false,
        //     autorestart: false,
        //     wait_ready: false,
        //     listen_timeout: 30000,
        // },
        // {
        //     name: "postgres-container",
        //     script: "docker",
        //     args: "run --rm -d -p 5434:5432 --name postgres -e POSTGRES_PASSWORD=YourSecretPassword postgres:latest",
        //     watch: false,
        //     autorestart: false,
        //     wait_ready: false,
        //     listen_timeout: 30000,
        // },
        {
            name: "redis-container",
            script: "docker",
            args: "start redis",
            autorestart: true
        },
        {
            name: "postgres-container",
            script: "docker",
            args: "start postgres",
            autorestart: true
        },

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
