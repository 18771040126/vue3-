import type { ColumnParams } from './column'
import type { PopconfirmProps } from 'ant-design-vue/es/popconfirm'
import type { ButtonProps, TooltipProps } from 'ant-design-vue/es/components'

export interface ActionItem extends Omit<ButtonProps, 'onClick'> {
  onClick?: Fn<ColumnParams, any>
  label?: string
  color?: 'success' | 'error' | 'warning'
  icon?: string
  popConfirm?: PopConfirm
  disabled?: boolean
  divider?: boolean
  // 业务控制是否显示
  ifHide?: boolean | ((action: ActionItem) => boolean)
  tooltip?: string | TooltipProps
  /** 设置按钮权限, effect不传默认为disable */
  auth?:
    | string
    | {
        perm: string
        effect?: 'delete' | 'disable'
      }
}

export type PopConfirm = PopconfirmProps & {
  title: string
  okText?: string
  cancelText?: string
  onConfirm: Fn<ColumnParams, any>
  onCancel?: Fn<ColumnParams, any>
  icon?: string
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'
    | 'bottomLeft'
    | 'bottomRight'
}
