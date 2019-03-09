module.exports = {
  pluginOptions: {
    i18n: {
      locale: 'fr',
      fallbackLocale: 'en',
      localeDir: 'i18n',
      enableInSFC: true
    }
  },
  devServer: {
    proxy: 'http://localhost:3000'
  }
  
}