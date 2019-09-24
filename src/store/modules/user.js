import { login, logout, getInfo } from '@/api/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Layout from '@/layout'

const fucMenuList = (menuArr, arr, level, prefixPath) => {
  for (const item of menuArr) {
    if (level === 1) {
      const path = item.path
      if (item.children && item.children.length > 1) {
        const menu = {
          path: path,
          component: Layout,
          redirect: path + '/' + item.children[0].path,
          meta: { title: item.name, icon: item.icon },
          children: []
        }
        arr.push(menu)
        fucMenuList(item.children, menu.children, level + 1, item.path)
      } else {
        const menu = {
          path: path,
          component: Layout,
          children: [
            {
              path: 'index',
              component: () => import(`@/views${item.path}/index`),
              meta: { title: item.name, icon: item.icon }
            }
          ]
        }
        arr.push(menu)
      }
    } else {
      const path = item.path
      if (item.children && item.children.length > 1) {
        const menu = {
          path: path,
          component: () => import(`@/views${prefixPath}/${item.path}`),
          meta: { title: item.name },
          children: []
        }
        console.log(`${prefixPath}/${item.path}`)
        arr.push(menu)
        fucMenuList(item.children, menu.children, level + 1, `${prefixPath}/${item.path}`)
      } else {
        const menu = {
          path: path,
          component: () => import(`@/views${prefixPath}/${item.path}`),
          meta: { title: item.name }
        }
        console.log(menu)
        arr.push(menu)
      }
    }
  }
}

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  userInfo: {}
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.TOKEN)
        setToken(data.TOKEN)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ dispatch, commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { name, avatar, logo } = data
        const roles = []
        fucMenuList(data.menuList, roles, 1, '')
        console.log('roles', roles)
        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_USERINFO', data)
        dispatch('app/updateLogo', logo, { root: true })
        resolve(roles)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

