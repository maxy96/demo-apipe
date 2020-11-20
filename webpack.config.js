const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    entry: {
      maps: './src/maps.js',
      main: ['./src/app.js', './src/styles/app.scss'],
    },
    output: {
      filename: './js/[name].js',
      path: path.resolve(__dirname, 'public')
    },
    watch: true,

    module:{
      rules:[{
        test:/\.scss$/,
        //include: ['/src/styles/', '/node_modules/'],
        use:[
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      }]
    },
    plugins:[
      new MiniCssExtractPlugin({
        filename: '/css/[name].css'
      }),
      new BrowserSyncPlugin({
        host: 'localhost',
        port: '3000',
        files: ['./*.html'],
        server: { baseDir: [__dirname]}
      })
    ],
}