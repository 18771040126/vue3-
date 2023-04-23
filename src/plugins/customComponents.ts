import type { App } from 'vue'

import { SvgIcon } from '@/components/base/SvgIcon'
import { IconFont } from '@/components/base/IconFont'
// import FsSearchBox from '@/components/base/FsSearchBox/index.vue'
// import FsModal  from '@/components/base/FsModal/index.vue'
// import FsSearchItem  from '@/components/base/FsSearchItem/index.vue'
// import FsTable  from '@/components/business/FsTable/src/FsTable.vue'
// import FsUpload from '@/components/base/FsUpload/index.vue'
import ZpEmpty from '@/components/base/ZpEmpty/index.vue'
/**
 * @fuction 全局注册自定义组件
 * @param app
 */
export const setupCustomComponents = (app: App) => {
  app.component(SvgIcon.name, SvgIcon)
  app.component(IconFont.name, IconFont)
  // app.component(FsSearchBox.name, FsSearchBox)
  // app.component(FsModal.name, FsModal)
  // app.component(FsSearchItem.name, FsSearchItem)
  // app.component(FsTable.name, FsTable)
  // app.component(FsUpload.name, FsUpload)
  app.component(ZpEmpty.name, ZpEmpty)
}
