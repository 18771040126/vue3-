<template>
  <Layout class="layout">
    <Layout.Sider
      v-if="themeStore.layout === 'sidemenu'"
      v-model:collapsed="collapsed"
      :width="asiderWidth"
      :collapsed-width="asiderWidth"
      :trigger="null"
      collapsible
      :theme="getTheme"
      class="layout-sider"
    >
      <Logo :collapsed="collapsed" />
      <AsideMenu :collapsed="collapsed" :theme="getTheme" />
    </Layout.Sider>
    <Layout>
      <PageHeader v-model:collapsed="collapsed" :theme="getTheme">
        <template v-if="themeStore.layout === 'topmenu'" #default>
          <Logo :collapsed="collapsed" />
          <AsideMenu :collapsed="collapsed" :theme="getTheme" />
        </template>
      </PageHeader>
      <div class="bread-crumb-bg">
        <Breadcrumb>
          <template v-for="routeItem in menus" :key="routeItem?.name">
            <Breadcrumb.Item>
              <span v-if="!routeItem?.meta?.hideInBreadcrumb" @click="handleItemClick(routeItem)">
                {{ routeItem?.meta?.title }}
              </span>
            </Breadcrumb.Item>
          </template>
        </Breadcrumb>
      </div>
      <Layout.Content class="layout-content">
        <div class="common-content">
          <div class="lay-out"></div>
          <div :class="['tabs-view-content', themeStore.isMultiTab ? '' : 'no-tab']">
            <router-view v-slot="{ Component }">
              <template v-if="Component">
                <!-- <transition
                  :name="Object.is(route.meta?.transitionName, false) ? '' : 'fade-transform'"
                  mode="out-in"
                  appear
                > -->
                <keep-alive :include="keepAliveComponents">
                  <component :is="Component" :key="route.fullPath" />
                </keep-alive>
                <!-- </transition> -->
              </template>
            </router-view>
          </div>
        </div>
      </Layout.Content>
      <!-- <PageFooter /> -->
    </Layout>
  </Layout>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue'
  import { Layout, Breadcrumb } from 'ant-design-vue'
  import Logo from './logo/index.vue'
  import AsideMenu from './menu/menu.vue'
  import PageHeader from './header/index.vue'
  import { useThemeStore } from '@/stores/modules/projectConfig'
  import { useKeepAliveStore } from '@/stores/modules/keepAlive'
  import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router'
  import { useUserStore } from '@/stores/modules/user'
  import { MENU_TYPE } from '@/constants'
  const userStore = useUserStore()
  const route = useRoute()
  const router = useRouter()
  const themeStore = useThemeStore()
  const collapsed = ref<boolean>(false)
  const keepAliveStore = useKeepAliveStore()
  // 缓存的路由组件列表
  const keepAliveComponents = computed(() => keepAliveStore.list)
  // 自定义侧边栏菜单收缩和展开时的宽度
  const asiderWidth = computed(() => (collapsed.value ? 80 : 180))
  const getTheme = computed(() => (themeStore.navTheme === 'light' ? 'light' : 'dark'))
  console.log(router.getRoutes(),'children:[]');
  
  const menus = computed(() => {
    if (route.meta?.namePath) {
      let children = router.getRoutes()
      const paths = route.meta?.namePath?.map((item) => {
        const a = children.find((n) => n.name === item)
        children = a?.children || children
        return a
      })
      return [...paths]
    }
    return route.matched
  })
  const handleItemClick = (menuItem: RouteRecordRaw | undefined) => {
    if (menuItem?.meta?.type === MENU_TYPE.menu) {
      const lastChild = findLastChild(menuItem)

      if (lastChild?.name === route.name) return
      if (/http(s)?:/.test(lastChild?.name)) {
        window.open(lastChild?.name)
      } else if (lastChild?.name) {
        router.push({ name: lastChild.name })
      }
    }
  }
  const findLastChild = (route?: RouteRecordRaw) => {
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
        return findLastChild(target)
      }
      return route?.redirect
    }
    return route
  }
</script>

<style lang="less" scoped>
  .layout {
    overflow: hidden;
    display: flex;
    height: 100vh;

    .ant-layout {
      overflow: hidden;
      background-color: #f3f3f3;
    }

    .layout-content {
      position: relative;
      overflow: auto;
      height: 100%;
      background: #f3f3f3;
    }
    .bread-crumb-bg {
      z-index: 1;
      height: 56px;
      padding-left: 24px;
      background: white;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
      .ant-breadcrumb {
        height: 56px;
        line-height: 56px;
      }
    }
    .common-content {
      position: relative;
      overflow: auto;
      height: 100%;
    }
    .lay-out {
      height: 16px;
      background: #f3f3f3;
    }
    .tabs-view-content {
      position: relative;
      min-height: calc(100% - 32px);
      margin: 0 16px 16px 16px;
      background: #fff;
    }
  }
</style>
