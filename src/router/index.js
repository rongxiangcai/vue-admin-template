import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/personalCenter',
    component: Layout,
    name: 'personalCenter',
    redirect: '/personalCenter/personal',
    hidden: true,
    meta: { title: '个人信息', icon: 'xxx' },
    children: [{
      path: 'personal',
      component: () => import('@/views/personalCenter/index')
    }]
  }

  // {
  //   path: '/systemSetting',
  //   component: Layout,
  //   redirect: '/systemSetting/accountSetting',
  //   name: '系统设置',
  //   meta: {
  //     title: '系统设置',
  //     icon: 'systemSetting'
  //   },
  //   children: [
  //     {
  //       path: 'accountSetting',
  //       component: () => import('@/views/systemSetting/accountSetting'),
  //       name: '账号设置',
  //       meta: { title: '账号设置' }
  //     },
  //     {
  //       path: 'permissionSetting',
  //       component: () => import('@/views/systemSetting/permissionSetting'),
  //       name: '权限设置',
  //       meta: { title: '权限设置' }
  //     },
  //     {
  //       path: 'enterpriseInfo',
  //       component: () => import('@/views/systemSetting/enterpriseInfo'),
  //       name: '企业信息',
  //       meta: { title: '企业信息' }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/test',
    component: Layout,
    redirect: '/test/test1',
    name: 'test',
    meta: {
      title: 'test',
      icon: 'nested'
    },
    children: [
      {
        path: 'test1',
        component: () => import('@/views/test/test1'), // Parent router-view
        meta: { title: 'test1' },
        children: [
          {
            path: 'test1-1',
            component: () => import('@/views/test/test1/test1-1'), // Parent router-view
            meta: { title: 'test1-1' }
          },
          {
            path: 'test1-2',
            component: () => import('@/views/test/test1/test1-2'), // Parent router-view
            meta: { title: 'test1-2' }
          }
        ]
      },
      {
        path: 'test2',
        component: () => import('@/views/test/test2'), // Parent router-view
        meta: { title: 'test2' },
        children: [
          {
            path: 'test2-1',
            component: () => import('@/views/test/test2/test2-1'), // Parent router-view
            meta: { title: 'test2-1' }
          },
          {
            path: 'test2-2',
            component: () => import('@/views/test/test2/test2-2'), // Parent router-view
            meta: { title: 'test2-2' }
          }
        ]
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
