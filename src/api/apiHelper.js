/**
 * Created by cairongxiang on 2018/4/18.
 */
import request from '@/utils/request'
import requestnotimeout from '@/utils/requestnotimeout'
import qs from 'qs'

export default function requestHelper(url, method, data, openJsonParams, opennotimeout) {
  return new Promise((resolve, reject) => {
    // console.log('params', qs.stringify(data))
    const transformRequest = openJsonParams ? [function(data, headers) {
      headers['Content-Type'] = 'application/json'
      return data
    }] : null
    let params
    switch (method) {
      case 'get':
        params = { url: url, method: method, params: { ...data, time: new Date().getTime() }}
        break
      case 'post':
        params = { url: url, method: method, data: (openJsonParams ? JSON.stringify(data) : qs.stringify(data)), transformRequest: transformRequest }
        break
      case 'put':
        params = openJsonParams ? { url: url, method: method, data: JSON.stringify(data), transformRequest: transformRequest } : { url: url, method: method, params: data }
        break
      case 'delete':
        params = openJsonParams ? { url: url, method: method, data: JSON.stringify(data), transformRequest: transformRequest } : { url: url, method: method, params: data }
        break
    }
    console.log(url + '---requestParam', data)
    if (opennotimeout) {
      requestnotimeout(params).then(response => {
        console.log(url + '---response', response)
        resolve(response)
      }).catch(error => {
        // 统一处理异常
        console.log(error)
        reject(error)
      })
    } else {
      request(params).then(response => {
        console.log(url + '---response', response)
        resolve(response)
      }).catch(error => {
        // 统一处理异常
        console.log(error)
        reject(error)
      })
    }
  })
}

