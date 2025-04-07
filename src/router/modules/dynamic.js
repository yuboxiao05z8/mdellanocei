import Layout from '@/layout'

/*
  动态导航管理
  @ roles [admin, normalUser, areaManager] 
    isAdmin
    0：超级管理员，1：普通用户，2：公司管理员
 */

const dynamicRouter = [
  {
    path: '/versionList',
    component: Layout,
    redirect: '/versionList',
    children: [
      {
        path: '/versionList',
        component: () => import('@/views/versionManage/versionList'),
        name: 'versionList',
        meta: {
          title: 'Version List',
          icon: 'el-icon-coin',
          roles: ['admin']
        },
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/accountLists',
    meta: {
      roles: ['admin', 'areaManager']
    },
    children: [
      {
        path: 'accountLists',
        component: () => import('@/views/accounts/accountLists'),
        name: 'accountLists',
        meta: {
          title: 'Account',
          icon: 'el-icon-s-check',
        }
      },
      {
        path: 'employeeList',
        component: () => import('@/views/accounts/employeeList'),
        name: 'employeeList',
        hidden: true,
        meta: {
          title: 'Employee List'
        }
      }
    ]
  },
  {
    path: '/copyProject',
    component: Layout,
    redirect: '/copyProject',
    children: [
      {
        path: '/copyProject',
        component: () => import('@/views/copyProject/copyProject'),
        name: 'copyProject',
        meta: {
          title: 'Copy Project',
          icon: 'el-icon-document-copy',
          roles: ['admin']
        },
      }
    ]
  },
  {
    path: '/feedback',
    component: Layout,
    redirect: '/feedback',
    children: [
      {
        path: '/feedback',
        component: () => import('@/views/feedback/feedback'),
        name: 'feedback',
        meta: {
          title: 'Feedback',
          icon: 'el-icon-edit-outline',
          roles: ['admin']
        },
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    redirect: '/config/email',
    name: 'config',
    meta: {
      title: 'Config',
      icon: 'el-icon-s-tools',
      roles: ['admin', 'areaManager']
    },
    children: [
      {
        path: 'email',
        component: () => import('@/views/allocation/email'),
        name: 'email',
        meta: {
          title: 'Email Config'
        },
      },
      {
        path: 'bankList',
        component: () => import('@/views/allocation/bankList'),
        name: 'bankList',
        meta: {
          title: 'Payer Bank'
        },
      }
    ]
  },
  {
    path: '/Interes',
    component: Layout,
    redirect: '/Interes/InterestedBuyers',
    children: [
      {
        path: 'InterestedBuyers',
        component: () => import('@/views/InterestedBuyers/index'),
        name: 'PotentialClients',
        meta: {
          title: 'Interes',
          icon: 'el-icon-star-on',
          roles: ['admin', 'areaManager']
        }
      },
      {
        path: 'BuyersStatistics',
        component: () => import('@/views/InterestedBuyers/statistics/BuyersStatistics'),
        name: 'BuyersStatistics',
        hidden: true,
        meta: {
          title: 'Buyers Statistics',
        }
      },
      {
        path: 'UnitStatistics',
        component: () => import('@/views/InterestedBuyers/statistics/UnitStatistics'),
        name: 'UnitStatistics',
        hidden: true,
        meta: {
          title: 'Unit Statistics',
        }
      }
    ]
  },
  {
    path: '/marketing',
    component: Layout,
    redirect: '/marketing/advertising',
    name: 'marketing',
    meta: {
      title: 'Marketing',
      icon: 'el-icon-s-goods',
      roles: ['admin']
    },
    children: [
      {
        path: 'advertising',
        component: () => import('@/views/marketing/advertising'),
        name: 'advertising',
        meta: {
          title: 'Project Advertising'
        },
      },
      {
        path: 'stimulate',
        component: () => import('@/views/marketing/stimulate'),
        name: 'stimulate',
        meta: {
          title: 'Commission Incentive'
        },
      }
    ]
  },

  {
    path: '/SalesBooking',
    component: Layout,
    redirect: '/SalesBooking/ProjectSales',
    name: 'SalesBooking',
    meta: {
      title: 'Sales Booking',
      icon: 'el-icon-s-claim',
      roles: ['admin', 'normalUser', 'areaManager']
    },
    children: [
      {
        path: 'ProjectSales',
        component: () => import('@/views/SalesBooking/ProjectSales/index'),
        redirect: '/SalesBooking/ProjectSales/ProjectSalesList',
        name: 'ProjectSales',
        meta: {
          title: 'Project Sales'
        },
        children: [
          {
            path: 'ProjectSalesList',
            component: () => import('@/views/SalesBooking/ProjectSales/list/ProjectSalesList'),
            name: 'ProjectSalesList',
            meta: { title: 'Sales List' }
          },
          {
            path: 'SalesChart',
            component: () => import('@/views/SalesBooking/ProjectSales/chart/SalesChart'),
            name: 'SalesChart',
            meta: { title: 'Sales Chart' }
          },
          {
            path: 'PDIList',
            component: () => import('@/views/SalesBooking/ProjectSales/pdiList/pdiList'),
            name: 'PDIList',
            type: ['Developers'],
            meta: {
              title: 'PDI List',
            },
          },
        ]
      },
      {
        path: 'SalesFlowchart',
        hidden: true,
        component: () => import('@/views/SalesBooking/SalesFlowchart'),
        name: 'SalesFlowchart',
        meta: { title: 'Sales Flowchart' }
      },
      {
        path: 'TransactionList',
        component: () => import('@/views/SalesBooking/TransactionList/index'),
        name: 'TransactionList',
        type: ['Developers'],
        meta: {
          title: 'Transaction List',
        },
      },
      {
        path: 'viewDetails',
        component: () => import('@/views/SalesBooking/TransactionList/viewDetails'),
        name: 'viewDetails',
        meta: {
          title: 'Transaction Details'
        },
        hidden: true
      },
      {
        path: 'salesRecord',
        component: () => import('@/views/SalesBooking/SalesRecord/index'),
        name: 'salesRecord',
        meta: {
          title: 'sales Record'
        },
      }
    ]
  },
]

export default dynamicRouter