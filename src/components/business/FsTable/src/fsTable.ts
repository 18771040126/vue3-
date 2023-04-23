import { tableProps } from 'ant-design-vue/es/table'
import type { PropType, ExtractPropTypes } from 'vue'
import type { TableColumn } from './types/column'
import type { LoadDataParams, OnChangeCallbackParams } from './types/table'
import type FsTable from './FsTable.vue'

export const fsTableProps = {
  ...tableProps(),
  rowClassName: {
    type: Function as PropType<(_record: any) => any>
  },
  /** 表格筛选条件 */
  queryParams: {
    type: Object,
    default: () => ({})
  },
  /** 是否显示索引号 */
  showIndex: {
    type: Boolean as PropType<boolean>,
    default: false
  },
   /** 是否进来就请求 */
   alwaysLoadData: {
    type: Boolean as PropType<boolean>,
    default: true
  },
  /** 索引列属性配置 */
  indexColumnProps: {
    type: Object as PropType<Partial<TableColumn>>,
    default: () => ({})
  },
  /** 表格数据请求函数 */
  dataRequest: {
    // 获取列表数据函数API
    type: Function as PropType<
      (
        params?: LoadDataParams,
        onChangeParams?: OnChangeCallbackParams
      ) => Promise<API.TableListResult>
    >
  }
} as const

export type FsTableProps = ExtractPropTypes<typeof fsTableProps>

export type FsTableInstance = InstanceType<typeof FsTable>

// 默认支持的插槽
export const defaultSlots = [
  'emptyText',
  'expandIcon',
  'title',
  'footer',
  'summary',
  'expandedRowRender',
  'customFilterIcon',
  'customFilterDropdown'
] as const
