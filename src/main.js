import { createApp } from 'vue'
import App from './App.vue'
import naive from "naive-ui";
import router from './router.js';
createApp(App).use(naive).use(router).mount('#app')
