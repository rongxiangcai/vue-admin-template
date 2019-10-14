import requestHelper from '@/api/apiHelper'

const methodGet = 'get'
const methodPost = 'post'
const methodPut = 'put'
const methodDelete = 'delete'

// 极验初次验证
export function firstVerify() {
  const url = '/security/initial'
  return requestHelper(url, methodGet)
}

// 登录 params(account, password, geetestChallenge, geetestValidate, geetestSeccode, gtServerStatus)
export function login(params) {
  const url = '/login'
  return requestHelper(url, methodPost, params)
}

// 获取用户信息
export function getInfo() {
  const url = '/self/info'
  return requestHelper(url, methodGet)
}

// 修改信息
export function updateInfo(params) {
  const url = '/self/update'
  return requestHelper(url, methodPut, params)
}

// 修改头像
export function updateAvatar(params) {
  const url = '/self/avatar/set'
  return requestHelper(url, methodPut, params)
}

// 修改密码
export function userPasswordUpdate(params) {
  const url = '/self/password/set'
  return requestHelper(url, methodPut, params)
}

// 退出登录
export function logout() {
  const url = '/logout/logout'
  return requestHelper(url, methodGet)
}

// 获取OSS上传签名信息
export function getUploadKey() {
  const url = '/oss/signature'
  return requestHelper(url, methodGet)
}

// 发送验证码
export function msgSend(params) {
  const url = '/sms/send'
  return requestHelper(url, methodGet, params)
}

// 绑定手机号码
export function cellphoneUpdate(params) {
  const url = '/self/cellphone/bind'
  return requestHelper(url, methodPut, params)
}

// 验证旧手机号码
export function cellphoneValid(params) {
  const url = '/self/sms/code/verify'
  return requestHelper(url, methodGet, params)
}

// 获取企业信息
export function tenantInfo() {
  const url = '/tenant/get'
  return requestHelper(url, methodGet)
}

// 修改企业信息
export function tenantInfoUpdate(params) {
  const url = '/tenant/update'
  return requestHelper(url, methodPut, params)
}

// 修改企业LOGO
export function tenantLogoUpdate(params) {
  const url = '/tenant/logo'
  return requestHelper(url, methodPut, params)
}

// 修改账号
export function accountUpdate(params) {
  const url = '/self/account/set'
  return requestHelper(url, methodPut, params)
}

// 日志分页
export function logPage(params) {
  const url = '/action/log/page'
  return requestHelper(url, methodPost, params)
}
