/**
 * @constants 邮箱正则
 */
export const emailReg = /^([a-zA-Z]|[0-9])(\w|-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/

/**
 * @constants 纳税人识别号（税号）正则
 */
export const taxpayerIdReg = /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/

/**
 * @constants 银行卡号正则
 */
export const bankNoReg = /^([1-9]{1})(\d{14}|\d{18})$/
