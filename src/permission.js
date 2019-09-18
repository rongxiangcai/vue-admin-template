import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  // console.log(router)
  // next()
  // return
  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const roles = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          const rolesTemp = [
            {
              path: '/view1',
              component: Layout,
              children: [
                {
                  path: 'view1',
                  name: 'view1',
                  component: () => import('@/views/view1/view1'),
                  meta: { title: 'view1', icon: 'form' }
                }
              ]
            }
          ]

          const asyncRoutes = [
            {
              path: '/nested',
              component: Layout,
              redirect: '/nested/menu1',
              name: 'Nested',
              meta: {
                title: 'Nested',
                icon: 'nested'
              },
              children: [
                {
                  path: 'menu1',
                  component: () => import('@/views/nested/menu1/index'), // Parent router-view
                  name: 'Menu1',
                  meta: { title: 'Menu1' },
                  children: [
                    {
                      path: 'menu1-1',
                      component: () => import('@/views/nested/menu1/menu1-1'),
                      name: 'Menu1-1',
                      meta: { title: 'Menu1-1' }
                    },
                    {
                      path: 'menu1-2',
                      component: () => import('@/views/nested/menu1/menu1-2'),
                      name: 'Menu1-2',
                      meta: { title: 'Menu1-2' },
                      children: [
                        {
                          path: 'menu1-2-1',
                          component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                          name: 'Menu1-2-1',
                          meta: { title: 'Menu1-2-1' }
                        },
                        {
                          path: 'menu1-2-2',
                          component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                          name: 'Menu1-2-2',
                          meta: { title: 'Menu1-2-2' }
                        }
                      ]
                    },
                    {
                      path: 'menu1-3',
                      component: () => import('@/views/nested/menu1/menu1-3'),
                      name: 'Menu1-3',
                      meta: { title: 'Menu1-3' }
                    }
                  ]
                },
                {
                  path: 'menu2',
                  component: () => import('@/views/nested/menu2/index'),
                  meta: { title: 'menu2' }
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

          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
          // next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
