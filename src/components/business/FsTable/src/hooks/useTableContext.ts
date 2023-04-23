import { provide, inject } from 'vue'
import type { FsTableType } from './index'

const key = Symbol('fs-table')

export function createTableContext(instance: FsTableType) {
  provide(key, instance)
}

export function useTableContext() {
  return inject(key) as FsTableType
}
