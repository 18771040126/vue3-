<template>
  <Layout.Header :style="headerStyle" class="layout-header">
    <Space :size="20">
      <slot>
        <Space :size="20">
          <span class="menu-fold" @click="() => emit('update:collapsed', !collapsed)">
            <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
          </span>
          <div class="tabs-bg" :style="{ width: tabsWidth + 'px' }">
            <Tabs
              v-if="themeStore.isMultiTab"
              :active-key="activeKey"
              hide-add
              type="editable-card"
              class="tabs"
              :hideAdd="true"
              @change="changePage"
              @edit="editTabItem"
            >
              <Tabs.TabPane v-for="pageItem in tabsList" :key="pageItem.fullPath">
                <template #tab>
                  <Dropdown :trigger="['contextmenu']">
                    <div style="display: inline-block">
                      <span>{{ pageItem.meta?.title }}</span>
                    </div>
                  </Dropdown>
                </template>
              </Tabs.TabPane>
            </Tabs>
          </div>
        </Space>
      </slot>
    </Space>
    <Space :size="6">
      <Dropdown
        class="right-menu-item"
        placement="bottomRight"
        :overlay-style="{ minWidth: '80px' }"
      >
        <div class="flex items-center h-40px">
          <span class="ml-8px cursor-pointer">
            <span class="user-name-bg">{{ userInfo.account }}</span>
            <down-outlined
              class="row-icon"
              :style="{ fontSize: '12px', color: '#999', marginLeft: '5px' }"
            />
          </span>
        </div>
        <template #overlay>
          <Menu>
            <Menu.Item @click="acctounSetAction">账号设置</Menu.Item>
            <Menu.Item>
              <div @click.prevent="doLogout">退出登录</div>
            </Menu.Item>
          </Menu>
        </template>
      </Dropdown>
    </Space>
  </Layout.Header>
</template>

<script lang="tsx" setup>
  import { computed, nextTick, ref, type CSSProperties, watch, type PropType, onMounted } from 'vue'
  import { useRouter, useRoute, type RouteRecordRaw } from 'vue-router'
  import { MenuFoldOutlined, MenuUnfoldOutlined, DownOutlined } from '@ant-design/icons-vue'
  import { Layout, message, Dropdown, Menu, Space, Tabs, type MenuTheme } from 'ant-design-vue'
  import { useUserStore } from '@/stores/modules/user'
  import { useKeepAliveStore } from '@/stores/modules/keepAlive'
  import { LOGIN_NAME } from '@/constants'
  import { useThemeStore } from '@/stores/modules/projectConfig'
  import { useTabsViewStore, blackList } from '@/stores/modules/tabsView'
  import { TABS_ROUTES } from '@/constants'
  import type { RouteLocation } from 'vue-router'
  // import Utils from 'fshows-utils-tool'
  // import { routeChange, routeReplaceChange } from '@/hooks/routeChange'
  // import { changeOrgServer } from '@/api'
  type RouteItem = Omit<RouteLocation, 'matched' | 'redirectedFrom'>
    defineOptions({
    name: 'Header'
  })
  const props = defineProps({
    collapsed: {
      type: Boolean
    },
    theme: {
      type: String as PropType<MenuTheme>
    }
  })
  const tabsViewStore = useTabsViewStore()
  const emit = defineEmits(['update:collapsed'])
  const userStore = useUserStore()
  const themeStore = useThemeStore()
  // const lockscreenStore = useLockscreenStore();
  const keepAliveStore = useKeepAliveStore()

  const activeKey = computed(() => tabsViewStore.getCurrentTab?.fullPath)
  // 标签页列表
  const tabsList = computed(() => tabsViewStore.getTabsList)

  const router = useRouter()
  const route = useRoute()
  // 获取简易的路由对象
  const getSimpleRoute = (route): RouteItem => {
    const { fullPath, hash, meta, name, params, path, query } = route
    return { fullPath, hash, meta, name, params, path, query }
  }

  let routes: RouteItem[] = []
  try {
    const routesStr = localStorage.getItem(TABS_ROUTES) as string | null | undefined
    routes = routesStr ? JSON.parse(routesStr) : [getSimpleRoute(route)]
  } catch (e) {
    routes = [getSimpleRoute(route)]
  }
  // 初始化标签页
  tabsViewStore.initTabs(routes)

  const userInfo = computed(() => userStore.userInfo)
  const headerStyle = computed<CSSProperties>(() => {
    const { navTheme, layout } = themeStore
    const isDark = navTheme === 'dark' && layout === 'topmenu'
    return {
      backgroundColor: navTheme === 'realDark' || isDark ? '' : '#f6f6f6',
      color: isDark ? 'rgba(255, 255, 255, 0.85)' : ''
    }
  })
  onMounted(() => {
    resizTabsView()
    window.onresize = () => {
      setTimeout(() => {
        resizTabsView()
      }, 300)
    }
  })
  const tabsWidth = ref(0) // tab标签的长度
  /**
   * @function 计算tabsview的宽度
   */
  const resizTabsView = () => {
    let left = props.collapsed ? 132 : 292
    if (document.getElementsByClassName('right-menu-item')[0]) {
      let right = document.getElementsByClassName('right-menu-item')[0].clientWidth + 40
      if (document.getElementsByClassName('right-menu-item')[1]) {
        right += document.getElementsByClassName('right-menu-item')[1].clientWidth
      }
      tabsWidth.value = document.body.clientWidth - left - right - 26
    } else {
      tabsWidth.value = 400
    }
  }
  watch(
    () => route.fullPath,
    () => {
      if (blackList.some((n) => n === route.name)) return
      // tabsViewMutations.addTabs(getSimpleRoute(route))
      tabsViewStore.addTabs(getSimpleRoute(route))
    },
    { immediate: true }
  )
  // 在页面关闭或刷新之前，保存数据
  window.addEventListener('beforeunload', () => {
    localStorage.setItem(TABS_ROUTES, JSON.stringify(tabsList.value))
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const findLastChild = (route?: RouteRecordRaw): any => {
    if (typeof route?.redirect === 'object') {
      const redirectValues = Object.values(route.redirect)
      if (route?.children?.length) {
        const target = route.children.find((n) =>
          redirectValues.some((m) => [n.name, n.path, n.meta?.fullPath].some((v) => v === m))
        )
        return findLastChild(target)
      }
      return redirectValues.find((n) => typeof n === 'string')
    } else if (typeof route?.redirect === 'string') {
      if (route?.children?.length) {
        const target = route.children.find((n) =>
          [n.name, n.path, n.meta?.fullPath].some((m) => m === route?.redirect)
        )
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        return findLastChild(target)
      }
      return route?.redirect
    }
    return route
  }
  // 切换页面
  const changePage = (key: string) => {
    Object.is(route.fullPath, key) || router.push(key)
  }
  // tabs 编辑（remove || add）
  const editTabItem = (targetKey: string, action: string) => {
    if (action == 'remove') {
      removeTab(tabsList.value.find((item) => item.fullPath == targetKey))
    }
  }

  // 关闭当前页面
  const removeTab = (route) => {
    console.log(route,'router');
    
    if (tabsList.value.length === 1) {
      return message.warning('这已经是最后一页，不能再关闭了！')
    }
    tabsViewStore.closeCurrentTab(route)
  }
  /**
   * @function 切换登录
   */
  const changeOrg = (item) => {
    console.log(item, '切换登录')
    // changeOrgServer({ orgId: item.orgId }).then((res) => {
    //   userStore.switchOrg(res)
    //   tabsViewStore.closeAllTabs()
    //   // 切换组织，不需要显示保存信息弹窗
    //   Utils.local.setItem('orgChange', 1)
    //   // window.location.href=""
    //   setTimeout(() => {
    //     window.location.href = '/home'
    //   }, 500)
    // })
  }
  /**
   * @function 账号设置
   */
  const acctounSetAction = () => {
    // routeChange('accountSet')
  }
  /**
   * @function 退出登录
   */
  const doLogout = async () => {
    // 如果不是rootadmin，则退出登录
    // await userStore.logout()
    keepAliveStore.clear()
    // 移除标签页
    localStorage.clear()
    message.success('退出成功')
    await nextTick()
    // routeReplaceChange(LOGIN_NAME)
  }
</script>

<style lang="less" scoped>
  .layout-header {
    z-index: 10;
    position: sticky;
    top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: @header-height;
    padding: 0 20px;

    * {
      cursor: pointer;
    }
    .tabs-bg {
      position: absolute;
      bottom: -16px;
    }
    .role-label {
      height: 20px;
      margin-right: 10px;
      padding: 0 8px;
      border-radius: 10px;
      background: @primary-color;
      color: #fff;
      font-size: 12px;
    }
    .user-name-bg {
      overflow: hidden;
      display: inline-block;
      max-width: 140px;
      height: 20px;
      margin-right: 10px;
      line-height: 20px;
      vertical-align: middle;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .right-menu-item {
      .row-icon {
        transform: rotate(0deg);
        transform-origin: 50% 50%;
      }
      &:hover {
        .row-icon {
          transform: rotate(180deg);
        }
      }
    }
  }
</style>
<style lang="less">
  .org-list-bg {
    overflow-y: auto;
    max-height: 240px;
  }
</style>
