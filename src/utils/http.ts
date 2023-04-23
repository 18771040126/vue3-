import Axios from 'axios'
import NProgress from 'nprogress'
import { ACCESS_TOKEN_KEY } from '@/constants'

Axios.defaults.baseURL = import.meta.env.BASE_API
const token = localStorage.getItem( ACCESS_TOKEN_KEY )

let http = Axios.create({
  timeout: 40000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8',
    token
  },
  baseURL: '/api'
})


// 请求拦截器
http.interceptors.request.use(
  config => {
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    NProgress.done()
    const res =  response.data
    return res
  },
  error => {}
)

export default http