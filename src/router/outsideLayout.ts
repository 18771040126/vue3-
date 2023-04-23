import type { RouteRecordRaw } from 'vue-router'
import { LOGIN_NAME } from '@/constants'

/**
 * @description layout之外的路由
 */
 const LoginRoute: RouteRecordRaw = {
    path: '/login',
    name: LOGIN_NAME,
    component: () => import ('@/views/Login/index.vue'),
    meta: {
      title:' 登录'
    }
  }

export default [LoginRoute]