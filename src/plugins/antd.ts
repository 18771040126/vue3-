import {
  Button,
  Table,
  Form,
  Input,
  Divider
} from 'ant-design-vue'

import type {App} from 'vue'
export const setupAntd = (app:App<Element>) => {
  app
    .use(Button)
    .use(Table)
    .use(Form)
    .use(Input)
    .use(Divider)
}