module.exports = {
    apps: [{
        name: "Innocalls-New-Portal",
        script: 'node_modules/next/dist/bin/next',
        args: 'start',
        env_production: {
            NODE_ENV: "production"
         },
         env_development: {
            NODE_ENV: "development"
         }
    }]
}