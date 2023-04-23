export const LOGIN_NAME = 'Login'

export const REDIRECT_NAME = 'Redirect'

export const PARENT_LAYOUT_NAME = 'ParentLayout'

export const PAGE_NOT_FOUND_NAME = 'PageNotFound'

// 路由白名单
export const WHITE_NAME_LIST = [LOGIN_NAME, 'icons', 'error', 'error-404'] as const // no redirect whitelist

export type WhiteNameList = typeof WHITE_NAME_LIST

export type WhiteName = typeof WHITE_NAME_LIST[number]

export const MENU_TYPE = {
  catalogue: 0, // 目录
  menu: 1, // 菜单
  pers: 2 // 权限
}
