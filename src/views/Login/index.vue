<template>
  <div class="login-box">
    <div class="login-logo">
      <h1 class="mb-0 ml-2 text-3xl font-bold">光伏</h1>
    </div>
    <a-form layout="horizontal" :model="state.formInline" @submit.prevent="handleSubmit">
      <a-form-item>
        <a-input v-model:value="state.formInline.username" size="large" placeholder="rootadmin">
          <template #prefix><user-outlined type="user" /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input
          v-model:value="state.formInline.password"
          size="large"
          type="password"
          placeholder="123456"
          autocomplete="new-password"
        >
          <template #prefix><lock-outlined type="user" /></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" size="large" :loading="state.loading" block>
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
  import { useRoute, useRouter } from 'vue-router'
  import { message, Modal } from 'ant-design-vue'
  import { useUserStore } from '@/stores/modules/user'

  const state = reactive({
    loading: false,
    formInline: {
      username: 'rootadmin',
      password: '123456'
    }
  })

  const route = useRoute()
  const router = useRouter()

  const useStore = useUserStore()
  const handleSubmit = async () => {
    const { username, password } = state.formInline
    if (username.trim() == '' || password.trim() == '') {
      return message.warning('用户名或密码不能为空！')
    }
    message.loading('登录中...', 0)
    state.loading = true
    // params.password = md5(password)
    try {
      await useStore.login(state.formInline).then(() => {
        state.loading = false
        message.destroy()
      })
      message.success('登录成功！')
      setTimeout(() => router.replace((route.query.redirect as string) ?? '/'))
    } catch (error: any) {
      Modal.error({
        title: () => '提示',
        content: () => error.errorMsg
      })
    }
  }
</script>

<style lang="less" scoped>
 .login-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100vh;
    padding-top: 240px;

    .login-logo {
      display: flex;
      align-items: center;
      margin-bottom: 30px;

      .svg-icon {
        font-size: 48px;
      }
    }

    :deep(.ant-form) {
      width: 400px;

      .ant-col {
        width: 100%;
      }

      .ant-form-item-label {
        padding-right: 6px;
      }
    }
  }
</style>
