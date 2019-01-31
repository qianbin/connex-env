const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')
const path = require('path')

module.exports = {
    lintOnSave: false,
    publicPath: '/',
    pwa: {
        workboxOptions: {
            skipWaiting: true,
            clientsClaim: true
        }
    },
    configureWebpack: {
        plugins: [
            new PurgecssPlugin({
                paths: glob.sync([
                    path.join(__dirname, './../src/index.html'),
                    path.join(__dirname, './../**/*.vue'),
                    path.join(__dirname, './../src/**/*.js')
                ])
            })
        ]
    }
}
