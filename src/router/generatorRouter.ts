import type { RouteRecordRaw } from 'vue-router'
import asyncRouterMap from '@/router/asyncRouter'
import router, { routes } from '@/router'
// import { REDIRECT_ROUTE } from './constantRouterMap/besidesLayout'
// import { notFound, errorRoute } from './constantRouterMap/error'
import { uniqueSlash } from '@/utils/urlUtils'
import outsideLayout from './outsideLayout'
// import common from '@/router/constantRouterMap'
import { MENU_TYPE } from '@/constants'

// 需要放在所有路由之后的路由
// const endRoutes: RouteRecordRaw[] = [REDIRECT_ROUTE, errorRoute, notFound]

/**
 * @function 获取重定向的路由名称（第一个）
 * @param route
 * @returns {string} 路由路径
 */
export const getLayoutRedirectPath = (route: RouteRecordRaw):any => {
  if (route.children && route.children.length) {
    return getLayoutRedirectPath(route.children[0])
  } else {
    return String(route.name)
  }
}

/**
 * @function 动态生成菜单
 * @param asyncMenus 菜单权限字段
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (asyncMenus: string[]) => {
  try {
    const routeList = filterAsyncRoute(asyncRouterMap, asyncMenus)
    console.log(routeList, '根据后端返回的权限生成路由')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const layout = routes.find((item) => item.name === 'Layout')!
    layout.redirect = getLayoutRedirectPath(routeList[0])

    // 给公共路由添加namePath
    // generatorNamePath(common)
    const menus = [ ...routeList ]
    layout.children = menus
    const removeRoute = router.addRoute(layout)
    // 获取所有没有包含children的路由，上面addRoute的时候，vue-router已经帮我们拍平了所有路由
    const filterRoutes = router
      .getRoutes()
      .filter(
        (item) =>
          (!item.children.length || Object.is(item.meta?.hideChildrenInMenu, true)) &&
          !outsideLayout.some((n) => n.name === item.name)
      )
    // 清空所有路由
    removeRoute()
    layout.children = [...filterRoutes]
    // 重新添加拍平后的路由
    router.addRoute(layout)
    console.log('router', layout)
    console.log('getRoutes', router.getRoutes())
    return {
      menus,
      routes: layout.children
    }
  } catch (error) {
    console.error('生成路由时出错', error)
    return {
      menus: [],
      routes: []
    }
  }
}

/**
 * @function 过滤账户是否拥有某一个权限，并将菜单从加载列表移除;根据route的name字段判断;
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission(permission: string[], route: RouteRecordRaw) {
  if(permission.length){
    if (route.path) {
      let flag = false
      for (let i = 0, len = permission.length; i < len; i++) {
        flag = route.path.indexOf(permission[i]) > -1
        if (flag) {
          return true
        }
      }
      return false
    }
  }
  return true
}

/**
 * @function 根据后端返回的权限生成路由
 * @param permission
 * @param route
 * @returns {boolean}
 */
export function filterAsyncRoute(
  routerMap: RouteRecordRaw[],
  asyncMenus: string[]
): RouteRecordRaw[] {
  const accessedRouters = routerMap.filter((route: RouteRecordRaw) => {
    if (route.meta?.type === MENU_TYPE.catalogue) {
      route.redirect = getLayoutRedirectPath(route)
    }
    if (hasPermission(asyncMenus, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRoute(route.children, asyncMenus)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

/**
 * @function 主要方便于控制a-menu的open-keys，即控制左侧菜单应当展开哪些菜单
 * @param {RouteRecordRaw[]} routes 需要添加namePath的路由
 * @param {string[]} namePath
 */
export const generatorNamePath = (
  routes: RouteRecordRaw[],
  namePath?: string[],
  parent?: RouteRecordRaw
) => {
  routes.forEach((item) => {
    if (item.children?.length) {
      if (item.meta && typeof item.name === 'string') {
        item.meta.namePath = Array.isArray(namePath) ? namePath.concat(item.name) : [item.name]
        item.meta.fullPath = parent?.meta?.fullPath
          ? [parent.meta.fullPath, item.path].join('/')
          : item.path
        item.meta.fullPath = uniqueSlash(item.meta.fullPath)
        generatorNamePath(item.children, item.meta.namePath, item)
      }
    } else {
      if (item.meta && typeof item.name === 'string') {
        item.meta.namePath = Array.isArray(namePath) ? namePath.concat(item.name) : [item.name]
        item.meta.fullPath = parent?.meta?.fullPath
          ? [parent.meta.fullPath, item.path].join('/')
          : item.path
        item.meta.fullPath = uniqueSlash(item.meta.fullPath)
      }
    }
  })
}
