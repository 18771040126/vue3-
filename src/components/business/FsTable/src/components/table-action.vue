<template>
  <template v-for="(actionItem, _index) in actionFilters" :key="`${_index}-${actionItem.label}`">
    <component
      :is="actionItem.popConfirm ? Popconfirm : 'span'"
      :title="actionItem.title"
      v-bind="actionItem.popConfirm"
      v-if="!actionItem.ifHide"
    >
      <a-divider type="vertical" v-if="_index" />
      <a-button class="table-link-btn operation-btn" type="link" v-bind="actionItem">{{
        actionItem.label
      }}</a-button>
    </component>
  </template>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { Popconfirm } from 'ant-design-vue'
  import type { PropType } from 'vue'
  import type { ActionItem } from '../types/tableAction'
  import { usePermission } from '@/hooks/usePermission'
  import { isString, isObject } from '@/utils/is'

  const props = defineProps({
    actions: {
      // 表格行动作
      type: Array as PropType<ActionItem[]>,
      default: () => []
    }
  })

  const { hasPermission } = usePermission()

  const actionFilters = computed(() => {
    return props.actions.filter((item) => {
      const auth = item.auth

      if (Object.is(auth, undefined)) {
        return true
      }
      if (isString(auth)) {
        const isValid = hasPermission(auth)
        item.disabled ??= !isValid
        if (item.disabled && !isValid) {
          item.title = '对不起，您没有该操作权限！'
        }
        return isValid
      }
      if (isObject(auth)) {
        const isValid = hasPermission(auth.perm)
        const isDisable = auth.effect !== 'delete'
        item.disabled ??= !isValid && isDisable
        if (item.disabled && !isValid) {
          item.title = '对不起，您没有该操作权限！'
        }
        return isValid || isDisable
      }
    })
  })
</script>
<style lang="less" scoped>
  .ant-btn-link.table-link-btn {
    height: 22px;
    padding: 0;
  }
</style>
