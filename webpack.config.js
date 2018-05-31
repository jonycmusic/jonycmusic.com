var path = require('path'),
    webpack = require ('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');;

    var isProd = (process.env.NODE_ENV == "production")
    console.log ( "Configuring webpack for "+(isProd?"prod":"dev "));

    module.exports = env => {
      
      return {
        mode: (isProd)? "production" : "development", // "production" | "development" | "none"
        // Chosen mode tells webpack to use its built-in optimizations accordingly.
        entry: ["./src/index.js", './src/scss/style.scss'],
        output: {
          // options related to how webpack emits results
          path: path.resolve(__dirname, "dist/static-files"), // string
          // the target directory for all output files
          // must be an absolute path (use the Node.js path module)
          filename: "bundle.js", // string
          // the filename template for entry chunks
          publicPath: "/static-files/", // string
          // the url to the output directory resolved relative to the HTML page
        },
        plugins: [
          new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            soundManager: "soundmanager2",
            "window.soundManager": "soundmanager2"
          }),
          new ExtractTextPlugin({filename:'style.css'}),
        ],
        module: {
            rules: [{
              test:/\.(s*)css$/, 
                use: ExtractTextPlugin.extract({ 
                  fallback:'style-loader',
                  use:['css-loader','sass-loader'],
                })
            },
            {
              test: /\.(svg|eot|ttf|woff|woff2|png)?$/,
              loader: 'url-loader'
            }]
        },
        devServer : {
          contentBase: path.join(__dirname, "assets"),
          compress: true,
          port: 9000,
          open: false
        }
      }
};