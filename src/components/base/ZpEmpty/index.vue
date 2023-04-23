<template>
  <div class="page-container">
    <img :src="getAssetsImages(imgUrl)" class="empty-img inline-block mt-196px" />
    <h1 class="empty-desc">{{ isError ? 'OOPS！你好像走丢了' : '你没有当前页面权限' }}</h1>
    <div v-if="isError">
      <RouterLink :to="{ path: '/home', replace: true }" class="ant-btn ant-btn-primary">
        回到首页
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="tsx">
  import { computed } from 'vue'
  defineOptions({
    name: 'ZpEmpty'
  })
  const props = defineProps({
    // 是否是404状态
    isError: {
      type: Boolean,
      default: false
    }
  })
  // 图片路径
  const imgUrl = computed(() => {
    return props.isError ? 'err_404' : 'empty_no_permit'
  })
  /**
   * @function 获取图片
   * @param {String} name 图片名
   */
  const getAssetsImages = (name) => {
    return new URL(`/src/assets/images/${name}.png`, import.meta.url).href
  }
</script>

<style lang="less" scoped>
  .page-container {
    // height: 100vh;
    text-align: center;
    background-color: white;
    .empty-img {
      width: 320px;
      height: 240px;
    }
    .empty-desc {
      padding: 16px 0;
      font-weight: 600;
      font-size: 16px;
    }
  }
</style>
