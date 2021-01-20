const path = require('path')
const settings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    port: settings.port,
    proxy: {
      '/': {
        target: settings.apiUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      }
    }
  },
  outputDir: path.resolve(settings.installPath, settings.proPath),
  configureWebpack: {
    name: settings.title,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload') // TODO: need test
    config.plugins.delete('prefetch') // TODO: need test

    // set svg-sprite-loader
    config.module
        .rule('svg')
        .exclude.add(resolve('src/components/common/icons'))
        .end()
    config.module
        .rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/components/common/icons'))
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
        .end()

    // set preserveWhitespace
    config.module
        .rule('vue')
        .use('vue-loader')
        .loader('vue-loader')
        .tap(options => {
          options.compilerOptions.preserveWhitespace = true
          return options
        })
        .end()
  }
}
