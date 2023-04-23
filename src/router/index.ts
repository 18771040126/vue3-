import 'nprogress/nprogress.css' // 进度条样式
import type { App } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { createRouterGuards } from './routerGuards'
import outsideLayout from './outsideLayout'
import { WHITE_NAME_LIST } from '@/constants'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    component: () => import(/* webpackChunkName: "layout" */ '@/layout/index.vue'),
    children: []
  },
  // Layout之外的路由
  ...outsideLayout
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.some((n) => n === name)) {
      router.hasRoute(name) && router.removeRoute(name)
    }
  })
}

export async function setupRouter(app: App) {
  // 创建路由守卫
  createRouterGuards(router, WHITE_NAME_LIST)

  app.use(router)

  // 路由准备就绪后挂载APP实例
  await router.isReady()
}

export default router
