import '../index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router'
import socket from './services/socket-helpers';

/* Create Vue app */
const app = createApp(App);
const pinia = createPinia();

/* Config websocket client side */
app.config.globalProperties.$socket = socket;

/* Use router and store if applicable */
app.use(router)
app.use(pinia)

/* Mount the app to the DOM */
app.mount('#app')
