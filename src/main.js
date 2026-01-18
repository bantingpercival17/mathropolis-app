import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap' // JS components like dropdown, modal
const isDebug = false
const baseURL = isDebug ? 'http://192.168.1.135:8001/api' : "http://games.bma.edu.ph/api"
axios.defaults.baseURL = baseURL;

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.use(router);
app.mount("#app");
