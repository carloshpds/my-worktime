/* eslint-disable @typescript-eslint/no-var-requires */

const WriteFilePlugin = require('write-file-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  configureWebpack: {
    devtool: 'cheap-module-source-map',
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'manifest.json'
          },
          {
            from: 'src/_locales',
            to: '_locales'
          },
          {
            from: 'src/assets',
            to: 'assets'
          },
          {
            from: 'background.js'
          }
        ]
      }),
    ]
  },

  filenameHashing: false,

  pages: {
    popup: {
      entry: 'src/apps/popup/index.ts',
      template: 'src/apps/popup/popup.html'
    },

    contentScripts: {
      entry: 'src/apps/content/index.js',
      chunks: [],
    },
  },
  chainWebpack: (config) => {
    config.plugin('writeFile')
      .use(WriteFilePlugin)
  },
};
