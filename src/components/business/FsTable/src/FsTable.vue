<template>
  <Table
    class="table-wrap"
    v-bind="getBindValues"
    :data-source="tableData"
    @change="handleTableChange"
  >
    <template
      v-for="slotName in defaultSlots.filter((name) => _Reflect.has($slots, name))"
      #[slotName]="slotData"
      :key="slotName"
    >
      <slot :name="slotName" v-bind="slotData"></slot>
    </template>

    <!-- S 个性化单元格 -->
    <template v-for="slotName in ['bodyCell', 'headerCell']" #[slotName]="slotData" :key="slotName">
      <slot :name="slotName" v-bind="slotData"></slot>
      <!-- S 表格行操作 -->
      <template v-if="slotName === 'bodyCell' && getColumnKey(slotData.column) === '$action'">
        <TableAction :actions="slotData.column.actions(slotData)" />
      </template>
      <!-- E 表格行操作end -->
      <template
        v-for="slotItem in getBindValues.columns?.filter((item) => item[slotName])"
        :key="getColumnKey(slotItem)"
      >
        <component
          :is="getComponent(slotItem?.[slotName]?.(slotData))"
          v-if="getColumnKey(slotData.column) === getColumnKey(slotItem)"
        />
      </template>
    </template>
    <!-- E 个性化单元格 -->
  </Table>
</template>

<script lang="tsx" setup>
  import { useSlots } from 'vue'
  import { fsTableProps, defaultSlots } from './fsTable'
  import { Table } from 'ant-design-vue'
  import { useTableMethods } from './hooks/useTableMethods'
  import { useTableState } from './hooks/useTableState'
  import { createTableContext } from './hooks/useTableContext'
  import { TableAction } from './components/index'

  defineOptions({
    name: 'FsTable',
    inheritAttrs: false
  })
  const props = defineProps(fsTableProps)
  const slots = useSlots()
  const _Reflect = Reflect

  // 表格内部状态
  const tableState = useTableState({ props, slots })
  const { tableData, getBindValues } = tableState

  // 表格内部方法
  const tableMethods = useTableMethods({ state: tableState, props })

  const { getColumnKey, fetchData, handleTableChange, getComponent } = tableMethods

  // 当前组件所有的状态和方法
  const instance = {
    ...props,
    ...tableState,
    ...tableMethods
  }

  createTableContext(instance)
  // alwaysLoadData默认为true  每次进入界面都会重新加载数据
  props.alwaysLoadData && fetchData(props.queryParams)

  defineExpose(instance)
</script>
