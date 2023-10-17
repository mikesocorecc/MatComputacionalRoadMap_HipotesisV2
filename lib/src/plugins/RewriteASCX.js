const fs = require('fs')
const path = require('path');
const chalk = require('chalk');
const ejs = require('ejs');
const ejs_options = {
    delimiter: '#', openDelimiter: '[', closeDelimiter: ']'
}
const server_http_base_url = process.env.PROGRENTIS_WEBPACK_PUBLIC_URL || 'http://localhost:8080/';
const Config = require('webpack-chain');
const config = new Config();

module.exports = class RewriteASCXPlugin {
    constructor(options) {
      this.options = options;
    }
    apply(compiler) {
        compiler.hooks.done.tap('RewriteASCXPlugin', stats => {

          try {
            var lista = {}
            Object.keys(stats.compilation.assets).map( name => {
                var new_name = name;
                if(process.env.WEBPACK_DEV_SERVER){
                    new_name = server_http_base_url + name
                } else {
                    new_name = `<%=ResolveUrl("dist/${name}")%>`;
                }
                if(!!name.match('app.js')){
                    lista['app_url'] = new_name;
                    return {app_url: new_name}
                }
                if(!!name.match('chunk-vendors.js')){
                    lista['chunk_vendors_url'] = new_name;
                    return {chunk_vendors_url: new_name}
                }
                if(!!name.match('app.css')){
                    lista['stylesheet_url'] = new_name;
                    return {stylesheet_url: new_name}
                }
                return new_name;
            })
            var ascx_html = fs.readFileSync(path.join(__dirname, '../assets/', `WebUserControl.ascx`)).toString()

            fs.writeFileSync(
                path.resolve(path.join(__dirname, '../../../', `${this.options.AscxFilename || 'WeBUserControl'}.ascx`)),
                ejs.render(
                    ascx_html, lista, ejs_options
                )
            );

            console.log(chalk.green.bold('WebUserControl generated'));
          } catch (error) {
            console.log(chalk.bold.bgRed('Exception:'), chalk.bold.red(error.message), error);
          }
        });
      }
   };
