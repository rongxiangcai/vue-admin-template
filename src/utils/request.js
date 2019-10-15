import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 15000, // 请求超时时间
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' }
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    // config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    const res = response.data
    console.log('first response', response)
    if (res.code !== 0) {
      Message({
        message: res.msg,
        type: 'error',
        duration: 2 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.code === 5 || res.code === 1 || res.code === 106 || res.code === 104 || res.code === 105) {
        if (res.code === 104 || res.code === 105) {
          setTimeout(() => {
            store.dispatch('user/logout').then(() => {
              location.reload()// 为了重新实例化vue-router对象 避免bug
            })
          }, 500)
        } else {
          store.dispatch('user/logout').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        }
      } else {
        console.log('error', response)
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 2 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
