import { createApp } from 'vue'
import * as VueRouter from 'vue-router';
import './style.css'
import App from './App.vue'
import routes from './routes'
import { createPinia } from 'pinia';

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes,
})
const app = createApp(App)
const pinia = createPinia();

app.use(pinia)

app.use(router)
app.mount('#app')
