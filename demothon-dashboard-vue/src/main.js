/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

import "vue3-openlayers/styles.css";

// Composables
import { createApp } from 'vue'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
