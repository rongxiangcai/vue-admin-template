/**
 * Created by cairongxiang on 2018/5/14.
 */
import requestHelper from '@/api/apiHelper'

const methodGet = 'get'
const methodPost = 'post'
const methodPut = 'put'
const methodDelete = 'delete'

// 新增角色 params(name, description, sort)
export function roleAdd(params) {
  const url = '/role/add'
  return requestHelper(url, methodPost, params)
}

// 批量删除角色 params(roleIds)
export function roleDelete(params) {
  const url = '/role/delete'
  return requestHelper(url, methodDelete, params)
}

// 修改角色 params(id)
export function roleUpdate(params) {
  const url = '/role/update'
  return requestHelper(url, methodPut, params)
}

// 启用角色 params(roleIds, enable)
export function roleEnable(params) {
  const url = '/role/enable'
  return requestHelper(url, methodPut, params)
}

// 批量获取角色 params(nameLike, mode, pageNum, pageSize, offset)
export function roleList(params) {
  const url = '/role/list'
  return requestHelper(url, methodGet, params)
}

// 获取菜单权限树 params(roleId)
export function permissionTree(params) {
  const url = '/permission/tree'
  return requestHelper(url, methodGet, params)
}

// 菜单权限设置 params()
export function permissionSetup(params) {
  const url = '/permission/setup'
  return requestHelper(url, methodPut, params)
}

// 新增账号 params()
export function userAdd(params) {
  const url = '/user/add'
  return requestHelper(url, methodPost, params)
}

// 批量删除账号 params(roleIds)
export function userDelete(params) {
  const url = '/user/delete'
  return requestHelper(url, methodDelete, params)
}

// 修改账号 params(id)
export function userUpdate(params) {
  const url = '/user/update'
  return requestHelper(url, methodPut, params)
}

// 批量获取账号 params(nameLike, mode, pageNum, pageSize, offset)
export function userList(params) {
  const url = '/user/list'
  return requestHelper(url, methodGet, params)
}
