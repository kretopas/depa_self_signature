import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// ? import BootStrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'

// ? import Axios for Vue
import VueAxios from 'vue-axios'
import axios from 'axios'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)
app.mount("#app")