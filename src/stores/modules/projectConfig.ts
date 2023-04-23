import { defineStore } from 'pinia'
import type { Theme } from 'ant-design-vue/es/config-provider/'
import { store } from '@/stores'

const styleDom = document.createElement('style')
styleDom.dataset.type = 'theme-dark'
document.head.appendChild(styleDom)

/**
 * 项目默认配置项
 * isMultiTab 是否显示标签页
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 */

/** 主题色 */
export type ThemeName = 'light' | 'dark' | 'realDark'
export type { Theme }

export type ThemeState = {
  isMultiTab: boolean
  navTheme: ThemeName // theme for nav menu
  primaryColor: string // '#F5222D', // primary color of ant design
  layout: 'sidemenu' | 'topmenu' // nav menu position: `sidemenu` or `topmenu`
  contentWidth: 'Fluid' | 'Fixed' // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: false // sticky header
  fixSiderbar: false // sticky siderbar
  colorWeak: false
  menu: {
    locale: true
  }
  title: string
  pwa: false
  iconfontUrl: string
}

export const defaultConfig: ThemeState = {
  isMultiTab: true, // 是否需要tab导航栏
  navTheme: 'dark', // theme for nav menu
  primaryColor: 'rgb(24, 144, 255)', // '#F5222D', // primary color of ant design
  layout: 'sidemenu', // nav menu position: `sidemenu` or `topmenu`
  contentWidth: 'Fluid', // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: false, // sticky header
  fixSiderbar: false, // sticky siderbar
  colorWeak: false,
  menu: {
    locale: true
  },
  title: 'web-vite-antdv-admin',
  pwa: false,
  iconfontUrl: ''
}

export const useThemeStore = defineStore({
  id: 'theme',
  state: (): ThemeState => ({
    ...defaultConfig
  })
})

// Need to be used outside the setup
export function useThemeStoreWithOut() {
  return useThemeStore(store)
}
