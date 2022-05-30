const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
    publicPath: './',
    outputDir: '../../static/res/vueCalculator',
    productionSourceMap: false,
    css: {
        extract: false
    },
    configureWebpack: config => {
        // config.mode = "development";
        config.output.filename = `js/[name].[fullhash:8].min.js`
        config.output.chunkFilename = `js/[name].[chunkhash:8].min.js`
        config.optimization = {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    extractComments: false,
                    terserOptions: {
                        parse: {},
                        compress: {
                            warnings: false,
                            drop_console: true,
                            drop_debugger: true,
                            // keep_fnames: true,
                        },
                    }
                })
            ],
        }
    }
}
