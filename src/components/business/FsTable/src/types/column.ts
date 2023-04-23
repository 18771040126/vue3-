import type { TableColumnType } from 'ant-design-vue'
import type { VNode } from 'vue'
import type { ActionItem } from './tableAction'

export type ColumnParams<T = any> = {
  record: T
  text: string
  index: number
  column: TableColumn<T>
}
/**
 * 表格属性
 */
export interface TableColumn<T = Indexable<any>>
  extends Omit<TableColumnType<T>, 'dataIndex' | 'key'> {
  title: string
  dataIndex: keyof T | '$action'
  key?: keyof T | '$action'
  width?: number | string
  /** 在 Table 中不展示此列 */
  hideInTable?: boolean
  bodyCell?: (params: ColumnParams<T>) => VNode | string
  headerCell?: (params: ColumnParams<T>) => VNode | string
  actions?: (params: ColumnParams<T>) => ActionItem[]
}
