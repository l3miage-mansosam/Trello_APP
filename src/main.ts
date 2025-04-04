import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import Bootstrap initialization utility
import { initBootstrap } from './utils/bootstrap'
    
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.mount('#app')

// Initialize Bootstrap components after the app is mounted
initBootstrap()