import Layout from '@/layout'
import inventoryRouter from './inventory'

import adminRouter from './admin'
import dynamicRouter from './dynamic'

export default [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'el-icon-s-data' }
      }
    ]
  },
  {
    path: '/changePassword',
    component: Layout,
    hidden: true,
    redirect: '/changePassword',
    children: [
      {
        path: '/changePassword',
        component: () => import('@/views/password/changePassword'),
        name: 'changePassword',
        meta: { title: 'Change Password' },
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true,
    meta: { title: 'Login' }
  },
  ...inventoryRouter,
  {
    path: "/notification",
    component: Layout,
    redirect: '/notification',
    children: [
      {
        path: '/notification',
        component: () => import('@/views/notification/notification'),
        name: 'notification',
        meta: { title: 'Notification', icon: 'el-icon-message-solid' }
      }
    ]
  },
  {
    path: "/calendar",
    component: Layout,
    redirect: '/calendar',
    children: [
      {
        path: '/calendar',
        component: () => import('@/views/calendar/calendar'),
        name: 'calendar',
        meta: { title: 'Calendar', icon: 'el-icon-date' }
      }
    ]
  },
  {
    path: "/universalTransactions",
    component: Layout,
    redirect: '/universalTransactions',
    children: [
      {
        path: '/universalTransactions',
        component: () => import('@/views/transactions/transactions'),
        name: 'transactions',
        meta: { title: 'Transactions', icon: 'el-icon-sell' }
      }
    ]
  },
  {
    path: "/architect",
    component: Layout,
    redirect: '/architect',
    children: [
      {
        path: '/architect',
        component: () => import('@/views/architect/architect'),
        name: 'architect',
        meta: { title: 'architect', icon: 'el-icon-sell' }
      }
    ]
  },
  {
    path: "/lawyer",
    component: Layout,
    redirect: '/lawyer',
    children: [
      {
        path: '/lawyer',
        component: () => import('@/views/lawyer/lawyer'),
        name: 'lawyer',
        meta: { title: 'lawyer', icon: 'el-icon-sell' }
      }
    ]
  },
  ...adminRouter,
  ...dynamicRouter
]