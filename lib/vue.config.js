const { defineConfig } = require('@vue/cli-service')
const webpack_config = require('./webpack.config')
const path = require('path')
const nombre = require('./package.json').name;
/**
 * Regresa un path similar a
 * DesktopModules\Progrentis\Programa3\FlowPaper\biblioteca-digital
 * @returns {String}
 */
function public_path(extra_path = '..') {
    var parts = path.resolve(path.join(__dirname, extra_path)).split(/[\\,\/]/g);
    var desktopmodules = parts.indexOf('DesktopModules') - 1;
    parts = parts.slice(desktopmodules);
    parts[0] = "";
    return parts.join("/").trim();
}

module.exports = defineConfig({
    configureWebpack: webpack_config,
    outputDir: path.resolve(path.join(__dirname, '../dist')),
    transpileDependencies: true,
    filenameHashing: false,
    css: {
        // https://cli.vuejs.org/config/#css-extract
        'extract': true,
        'sourceMap': true
    },
    publicPath: process.env.NODE_ENV == 'production' ? public_path('../dist') : 'http://localhost:8080/',
    devServer: {
        devMiddleware: {
            writeToDisk: true,
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
        // host: 'prod.progrentis.prg',
        allowedHosts: ['localhost', '.progrentis.prg'],
        headers: { "Access-Control-Allow-Origin": "*" },
        hot: false,
    },
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/WebUserControl.ejs',
            filename: `../${nombre}.ascx`,
            inject: false,
            minify: false,
        }
    }
})
