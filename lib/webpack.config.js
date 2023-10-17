// https://vue-loader.vuejs.org/guide/#manual-setup
// webpack.config.js
const package_json = require('./package.json');

module.exports = {
    module: {
        rules: [
            {
                test: /\.ejs$/,
                loader: 'underscore-template-loader',
                options: {
                    interpolate: /<\$=([\s\S]+?)\$>/g,
                    escape: /<\$-([\s\S]+?)\$>/g,
                    evaluate: /<\$([\s\S]+?)\$>/g,
                }
            },
            {
                test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
                type: 'asset',
                generator: {
                    filename: 'img/[name][ext]'
                },
                parser: {
                    dataUrlCondition: {
                        maxSize: -1
                    }
                }
            },
            {
                test: /\.xml$/,
                type: 'asset',
                generator: {
                    filename: 'bitmapFont/[name][ext]'
                }
            }
        ]
    }
};
