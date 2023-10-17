const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://api.unsplash.com',
    setupNodeEvents(on, config) {
    },
    env: {
      snapshotOnly: true
    }
  },
})