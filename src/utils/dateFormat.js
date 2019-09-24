/**
 * Created by cairongxiang on 2018/4/17.
 */
export function timestampToTime(timestamp) {
  const date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = date.getFullYear()
  const M = date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1
  const D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
  // const h = date.getHours() + ':'
  // const m = date.getMinutes() + ':'
  // const s = date.getSeconds()
  return [Y, M, D]
}

export function timeToTimestamp(time) {
  const date = new Date(time) // '2014-04-23 18:55:49:123'
  // 有三种方式获取
  const time1 = date.getTime()
  return time1
  // let time2 = date.valueOf()
  // let time3 = Date.parse(date)
  // console.log(time1)// 1398250549123
  // console.log(time2)// 1398250549123
  // console.log(time3)// 1398250549000
  // 以上三种获取方式的区别：第一、第二种：会精确到毫秒 第三种：只能精确到秒，毫秒用000替代
}

export function timestampToTimeStr(timestamp) {
  var date = new Date(timestamp)
  const Y = date.getFullYear() + '-'
  const M = judge(date.getMonth() + 1) + '-'
  const D = judge(date.getDate()) + ' '
  const h = judge(date.getHours()) + ':'
  const m = judge(date.getMinutes()) + ':'
  const s = judge(date.getSeconds())
  return Y + M + D + h + m + s
  function judge(a) {
    return a < 10 ? '0' + a : a + ''
  }
}
