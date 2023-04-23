import { createApp } from 'vue'
import App from './App.vue'
import {setupRouter} from './router'
import { setupStore } from '@/stores'
import {setupAntd, setupAssets, setupCustomComponents} from '@/plugins'
const app = createApp(App)



function setupPlugins() {
  // 全局注册 ant-design-vue 组件
  setupAntd(app)
  // 引入静态资源
  setupAssets()
  // 注册全局自定义组件,如：<svg-icon />
  setupCustomComponents(app)
}

async function setupApp() {
  // 挂载 pinia 状态管理
  setupStore(app)
  // 挂载路由
  await setupRouter(app)
  app.mount('#app')
}


setupPlugins()

setupApp()