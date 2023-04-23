import { isString, isObject } from 'lodash-es'
import { unref } from 'vue'
import type { VNode } from 'vue'
import type { TableColumn } from '../types/column'
import type { OnChangeCallbackParams } from '../types/table'
import type { TableState } from './useTableState'
import type { FsTableProps } from '../fsTable'

export type TableMethods = ReturnType<typeof useTableMethods>

export type UseTableMethodsContext = {
  state: TableState
  props: FsTableProps
}
export const useTableMethods = ({ state, props }: UseTableMethodsContext) => {
  const { innerPropsRef, tableData, loadingRef, paginationRef } = state

  const setProps = (props: Partial<FsTableProps>) => {
    innerPropsRef.value = { ...unref(innerPropsRef), ...props }
  }

  /**
   * @function 获取表格列key
   */
  const getColumnKey = (column: TableColumn) => {
    return column?.key || column?.dataIndex
  }

  const getComponent = (comp: VNode | string) => {
    return isString(comp) ? <>{comp}</> : comp
  }

  /**
   * @function 表格查询
   */
  const handleSubmit = (params, page = 1) => {
    params.page = page
    const pagination = unref(paginationRef)
    if (isObject(pagination)) {
      pagination.current = page
    }
    fetchData(params)
  }

  /**
   * @function 获取表格数据
   * @param {object} params 表格查询参数
   */
  const fetchData = async (params = props.queryParams, rest?: OnChangeCallbackParams) => {
    // 如果用户没有提供dataSource并且dataRequest是一个函数，那就进行接口请求
    if (
      Object.is(props.dataSource, undefined) &&
      Object.prototype.toString.call(props.dataRequest).includes('Function')
    ) {
      const _pagination = unref(paginationRef)!
      // 是否启用了分页
      const enablePagination = isObject(_pagination)
      const queryParams = {
        ...params
      }
      if (enablePagination) {
        Object.assign(queryParams, {
          page: _pagination.current,
          pageSize: _pagination.pageSize
        })
      }
      loadingRef.value = true
      const data = await props
        ?.dataRequest?.(queryParams, rest)
        .finally(() => (loadingRef.value = false))

      if (data?.totalCount !== undefined) {
        const { totalCount } = data

        if (enablePagination && _pagination?.current) {
          // 有分页时,删除当前页最后一条数据时 往前一页查询
          if (data?.list.length === 0 && _pagination.current > 1) {
            _pagination.current--
            return fetchData(props.queryParams)
          }
        }

        Object.assign(unref(paginationRef), {
          total: ~~totalCount
        })
      }
      if (Array.isArray(data?.list)) {
        tableData.value = data!.list
      } else if (Array.isArray(data)) {
        tableData.value = data
      } else {
        tableData.value = []
      }
    }
    return tableData
  }

  /**
   * @function 刷新表格
   * @param resetPageIndex 是否将页数重置到第一页
   */
  const reload = async (resetPageIndex = false, params = {}) => {
    const pagination = unref(paginationRef)
    if (Object.is(resetPageIndex, true) && isObject(pagination)) {
      pagination.current = 1
    }
    return await fetchData(params)
  }

  /**
   * @description 分页改变
   */
  const handleTableChange = async (...rest: OnChangeCallbackParams) => {
    const [pagination] = rest
    const params = {
      ...props.queryParams,
      page: pagination.current,
      pageSize: pagination.pageSize
    }
    Object.assign(unref(paginationRef), pagination || {})
    fetchData(params, rest)
  }

  return {
    setProps,
    getComponent,
    handleSubmit,
    handleTableChange,
    getColumnKey,
    fetchData,
    reload
  }
}
