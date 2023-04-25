import { createApp } from 'vue'
import App from './App.vue'
// element-ui
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 路由
import router from './router/index'
// 引入logo
import "./assets/font/iconfont.css"
// 引入全局样式
import "./index.css"

createApp(App).use(router).use(ElementPlus).mount('#app')
