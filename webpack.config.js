const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

var baseConfiguration = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname,
    filename: 'disconnected.city.bundle.js'
  },
  module: {
    rules: [
      {test: /\.(js|jsx)$/, use: 'babel-loader'}
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index-template.html'
    })
  ]
}

module.exports = function (envOptions = {}) {
  if (envOptions.profile === 'development') {
    const devServerPort = 3130
    const entry = baseConfiguration.entry
    entry.push(`webpack-dev-server/client?http://0.0.0.0:${devServerPort}`)
    const output = Object.assign(baseConfiguration.output, {
      publicPath: `http://localhost:${devServerPort}/`
    })
    return Object.assign(baseConfiguration, {
      devtool: "cheap-eval-source-map",
      devServer: {
        contentBase: ".",
        publicPath: "/",
        noInfo: false,
        quiet: false,
        compress: true,
        port: devServerPort
      },
      entry,
      output
    })
  }
  return baseConfiguration
}