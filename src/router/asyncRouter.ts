import type {RouteRecordRaw} from 'vue-router'
import { MENU_TYPE } from '@/constants'


const asyncRouterMap: Array<RouteRecordRaw> = [
  {
    name: 'home',
    path: '/home',
    meta: {
      title: '首页',
      icon: 'icon-home',
      type: MENU_TYPE.menu,
      namePath: ['/home']
    },
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home/index.vue')
  },
  {
    name: 'systemManage',
    path: '/systemManage',
    meta: {
      title: '系统管理',
      icon: 'systemManage',
      keepAlive: false,
      type: MENU_TYPE.menu,
      namePath: ['/systemManage']
    },
    component: () => import ('@/views/SystemManage/index.vue'),
  },
  {
    name: 'salesManage',
    path: '/salesManage',
    meta: {
      title: '销售管理',
      icon: 'salesManage',
      keepAlive: false,
      type: MENU_TYPE.menu,
      namePath: ['/salesManage']
    },
    component: () => import ('@/views/SalesManage/index.vue'),
  },
  {
    name: 'engineManage',
    path: '/engineManage',
    meta: {
      title: '工程管理',
      icon: 'engineManage',
      keepAlive: false,
      type: MENU_TYPE.menu,
      namePath: ['/engineManage']
    },
    component: () => import ('@/views/EngineManage/index.vue'),
  },
]
export default asyncRouterMap