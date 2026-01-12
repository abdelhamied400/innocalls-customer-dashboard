module.exports = {
    apps: [{
        name: "Innocalls-New-Portal",
        script: 'node_modules/next/dist/bin/next',
        args: 'start',

        // Instance control
        instances: 1,
        exec_mode: "fork",

        // Restart controls
        max_memory_restart: "512M",
        max_restarts: 10,
        min_uptime: "10s",
        restart_delay: 5000,

        // Logging - logs stored in /usr/app/logs inside container
        error_file: "./logs/error.log",
        out_file: "./logs/out.log",
        log_date_format: "YYYY-MM-DD HH:mm:ss Z",
        merge_logs: true,

        // Auto-restart on file changes (disabled for production)
        watch: false,

        env_production: {
            NODE_ENV: "production"
        },
        env_development: {
            NODE_ENV: "development"
        }
    }]
}