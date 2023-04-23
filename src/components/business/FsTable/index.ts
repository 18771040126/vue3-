import type { Ref } from 'vue'
import FsTable from './src/FsTable.vue'
import type { FsTableInstance } from './src/fsTable'
export { FsTable }

export * from './src/types/'
export * from './src/hooks/'
export * from './src/fsTable'
export * from './src/components/'

export type FsTableRef = Ref<FsTableInstance>
