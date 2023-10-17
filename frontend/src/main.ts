import '../index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import router from './router'

/* Create Vue app */
const app = createApp(App);
const pinia = createPinia();

/* Use router and store if applicable */
app.use(router)
app.use(pinia)

/* Mount the app to the DOM */
app.mount('#app')


