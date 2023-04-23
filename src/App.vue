<template>
  <ConfigProvider :locale="zhCN">
    <router-view #="{ Component }">
      <component :is="Component" />
    </router-view>
  </ConfigProvider>
</template>

<script setup lang="ts">
  import { watchEffect } from 'vue'
  import { useRoute } from 'vue-router'
  import { ConfigProvider } from 'ant-design-vue'
  import zhCN from 'ant-design-vue/es/locale/zh_CN'

  const route = useRoute()

  watchEffect(() => {
    if (route.meta?.title) {
      document.title = route.meta.title as string
    }
  })
</script>

<style lang="less"></style>
