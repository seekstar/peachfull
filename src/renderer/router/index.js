import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRoutes = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人账户', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/profile',
    name: 'Dashboard',
    hidden: true

  },

  { path: '*', redirect: '/404', hidden: true }
]
export const asyncRoutes = [
  {
    path: '/shop',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '商店',
        // component: () => import('@/views/shop/index'),
        meta: {
          title: '商店', elicon: 'el-icon-s-shop', roles: ['buyer']
        }
      }
    ]
  },
  {
    path: '/cart',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '购物车',
        // component: () => import('@/views/cart/index'),
        meta: {
          title: '购物车', elicon: 'el-icon-shopping-cart-2', roles: ['buyer']
        }
      }
    ]
  },
  {
    path: '/buy',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '我买到的',
        // component: () => import('@/views/buy/index'),
        meta: {
          title: '我买到的', elicon: 'el-icon-goods', roles: ['buyer']
        }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '商品管理',
        // component: () => import('@/views/goods/index'),
        meta: {
          title: '商品管理', elicon: 'el-icon-setting', roles: ['seller']
        }
      }
    ]
  },
  {
    path: '/sell',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '我卖出的',
        // component: () => import('@/views/sell/index'),
        meta: {
          title: '我卖出的', elicon: 'el-icon-s-goods', roles: ['seller']
        }
      }
    ]
  }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
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
