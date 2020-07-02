module.exports = {
  devServer: {
    host: 'localhost',
    port: 8082,
    proxy: {
      '/api': {
        target: 'http://mengxuegu.com:7300/mock/5efb5ad179572d3cdb458e83',
        changeOrigin: true,
        pathRewrite: {
          '/api': ''
        }
      }
    }
  },
  css: {
      loaderOptions: {
          less: {
            lessOptions:{
              javascriptEnabled: true,
            }
          }
      }
  },
}