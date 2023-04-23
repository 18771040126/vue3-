<template>
  <!-- S 目录 -->
  <template v-if="isShowSubMenu">
    <Menu.SubMenu :key="props.menuInfo?.name" v-bind="$attrs">
      <template #title>
        <span>
          <span>
            <svg-icon
              v-if="props.menuInfo?.meta?.icon"
              class="anticon"
              :name="props.menuInfo?.meta?.icon"
              size="18"
            />
            <span>{{ props.menuInfo?.meta?.title }}</span>
          </span>
        </span>
      </template>
      <template v-for="item in menuChildren" :key="item.name || item.fullPath">
        <!-- S 递归生成菜单 -->
        <MyMenuItem :menu-info="item" />
        <!-- E 递归生成菜单 -->
      </template>
    </Menu.SubMenu>
  </template>
  <!-- E 目录 -->
  <!-- S 菜单 -->
  <template v-else>
    <Menu.Item :key="props.menuInfo?.name">
      <span>
        <svg-icon
          v-if="props.menuInfo?.meta?.icon"
          class="anticon"
          :name="props.menuInfo?.meta?.icon"
          size="18"
        />
        <span>{{ props.menuInfo?.meta?.title }}</span>
      </span>
    </Menu.Item>
  </template>
  <!-- E 菜单 -->
</template>

<script setup lang="ts">
  import { type PropType, computed } from 'vue'
  import { Menu } from 'ant-design-vue'
  import {useRouter} from 'vue-router'
  import type { RouteRecordRaw } from 'vue-router'
  defineOptions({
    name: 'MyMenuItem'
  })
  const props = defineProps({
    menuInfo: {
      type: Object as PropType<RouteRecordRaw>
    }
  })
  const router = useRouter()
  const menuChildren = computed(() => {
    return router.getRoutes()
  })

  const isShowSubMenu = computed(() => {
    const menuInfo = props.menuInfo
    return (
      menuInfo?.meta?.type === 0 ||
      (!Object.is(menuInfo?.meta?.hideChildrenInMenu, true) && menuInfo?.children?.length)
    )
  })
</script>
<style scoped lang="less">
  .anticon {
    &.svg-icon {
      vertical-align: -0.3em;
    }
  }
</style>
