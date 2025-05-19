/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import pinia from '@/stores'
import router from '@/router'



import OpenLayersMap from "vue3-openlayers";


export function registerPlugins(app) {

  app
    .use(vuetify)
    .use(OpenLayersMap, {
      debug: true
    })
    .use(router)
    .use(pinia)
}
