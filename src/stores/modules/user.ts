import {defineStore} from 'pinia'
import type {RouteRecordRaw} from 'vue-router'
import {store} from '@/stores'
import { loginServer, logOutServer } from '@/api/login'
import {ACCESS_TOKEN_KEY, USER_INFO_KEY} from '@/constants'
import {generatorDynamicRouter} from '@/router/generatorRouter'
interface userState {
  token: string,
  menus: Array<RouteRecordRaw>
  perms: string[]
  userInfo: any
}
export const useUserStore = defineStore({
  id:'user',
  state: (): userState => ({
    token: '',
    menus: [],
    perms:[],
    userInfo: {}
  }),
  getters: {
    getToken():string {
      return this.token
    },
     getPerms(): string[] {
      return this.perms
    }
  },
  actions: {
    /**
     * @func 存储本地token
     */
    setToken(token: string) {
      this.token = token || ''
      localStorage.setItem(ACCESS_TOKEN_KEY,JSON.stringify(token))
    },
    /**
     * @func 存储本地用户信息
     */
    setUserInfo(info) {
      this.userInfo = {...this.userInfo, ...info} ?? {}
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(this.userInfo))
    },
    /**
     * @function 获取功能权限、菜单权限
     */
    async getPerMenu() {
      const { menuList = [], functionList = [] } = this.userInfo
      // 生成路由
      const generatorResult = generatorDynamicRouter(menuList)
      this.menus = generatorResult.menus.filter((item) => !item.meta?.hideInMenu)
      this.perms = [...menuList, ...functionList]
      return {
        menus: this.menus,
        perms: this.perms
      }
    },
    /**
     * @func 登录接口
     */
    async login(params:API.LoginParams) {
      try {
        const data = await loginServer(params)
        this.setToken(data.token)
        this.setUserInfo(data)
        this.userInfo = data
        this.perms = [...data.menuList, ...data.functionList]
        return {
          menus:this.menus,
          perms:this.perms,
          userInfo: data
        }
      }
      catch(error) {
        return Promise.reject(error)
      }
    },
    /**
     * @func 退出
     */
    async logout () {
      await logOutServer()
      this.resetToken()

    },
    /**
     * @func 清空token及用户数据
     */
    resetToken (){
      this.token = ''
      this.userInfo = {}
      this.menus = []
      localStorage.clear()
    }
  }
})

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUserStore(store)
}
