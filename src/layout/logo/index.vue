<template>
  <div class="logo justify-center">
    <img src="~@/assets/images/logo.png" />
    <h2 v-show="!collapsed" class="title">后台应用</h2>
    <!-- <img
      v-if="!collapsed"
      class="ml-6px"
      src="~@/assets/images/logo.png"
      width="44"
      height="19"
    /> -->
  </div>
</template>
<script lang="ts" setup>
  defineOptions({
    name: 'Logo'
  })
  defineProps({
    collapsed: {
      type: Boolean
    }
  })
</script>

<style lang="less" scoped>
  .logo {
    @apply flex overflow-hidden whitespace-nowrap items-center;

    height: 64px;
    line-height: 64px;

    img {
      height: 32px;
      margin-right: 8px;
    }
    .title {
      @apply mb-0 text-xl;
      color: @primary-color;
    }
  }
</style>
