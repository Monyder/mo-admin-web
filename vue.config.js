const path = require('path')
module.exports = {
  devServer: {
    port: 9899,
    proxy: {
      '/': {
        target: 'http://192.168.1.208:8099/base',
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  },
  outputDir: path.resolve('d:/work/baseWork/base-project/', './src/main/resources/static')
}
