import router from './index'
import store from '../store'

router.beforeEach(async (to, from, next) => {
  const userId = JSON.parse(sessionStorage.getItem('userInfo') || '{}').userId || ''
  if (userId) {
    if (to.path === '/login') {
      next('/')
    } else {
      if (store.getters.permission_routes.length) {
        document.title = to.meta.title
        next()
      } else {
        try {
          let isAdmin = JSON.parse(sessionStorage.getItem('userInfo') || '{}').isAdmin

          let roles = ''
          switch (isAdmin) {
            case 0:
              roles = 'admin'
              break;
            case 1:
              roles = 'normalUser'
              break;
            case 2:
              roles = 'areaManager'
              break;
          }

          const accessRoutes = await store.dispatch('permission/generateRoutes', [roles])
          router.addRoutes(accessRoutes)
          // console.log('创建导航', accessRoutes)
          next({ ...to, replace: true })
        } catch (err) {
          next()
        }
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})