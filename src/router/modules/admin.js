import Layout from '@/layout'

const adminRouter = [
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/generalFiles',
    name: 'admin',
    meta: {
      title: 'Admin',
      icon: 'el-icon-user-solid',
      roles: ['admin', 'areaManager']
    },
    children: [
      {
        path: "generalFiles",
        component: () => import('@/views/admin/generalFiles'),
        name: 'generalFiles',
        meta: { title: 'General Files' }
      },
      {
        path: "auditLogs",
        component: () => import('@/views/admin/auditLogs'),
        name: 'auditLogs',
        meta: { title: 'Audit Logs' }
      },
      {
        path: "userManagement",
        component: () => import('@/views/admin/index'),
        name: 'userManagement',
        redirect: '/admin/userManagement/userList',
        meta: { title: 'User Management' },
        children: [
          {
            path: 'userList',
            component: () => import('@/views/admin/userManagement/userList'),
            name: 'userList',
            meta: { title: 'User List' }
          },
          {
            path: 'createNewUsers',
            component: () => import('@/views/admin/userManagement/createNewUsers'),
            name: 'createNewUsers',
            meta: { title: 'Create New Users' }
          },
          {
            path: 'createNewTeams',
            component: () => import('@/views/admin/userManagement/createNewTeams'),
            name: 'teams',
            meta: { title: 'Teams' }
          },
          {
            path: 'roles',
            component: () => import('@/views/admin/userManagement/roles'),
            name: 'roles',
            meta: { title: 'Roles' }
          }
        ]
      }
    ]
  },
  {
    path: '/navigation',
    component: Layout,
    redirect: '/navigation/creationNav',
    name: 'navigation',
    meta: {
      title: 'Navigation',
      icon: 'el-icon-guide',
      roles: ['admin', 'areaManager']
    },
    children: [
      {
        path: "creationNav",
        component: () => import('@/views/navigation/creationNav/creationNav'),
        name: 'creationNav',
        meta: { title: 'Creation Navigation' }
      },
      {
        path: "allotNav",
        component: () => import('@/views/navigation/allotNav/allotNav'),
        name: 'allotNav',
        meta: { title: 'Management of navigation' }
      },
    ]
  }
]

export default adminRouter