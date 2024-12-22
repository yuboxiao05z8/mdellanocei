import router from './index'

router.beforeEach(async (to, from, next) => {
  const userId = JSON.parse(sessionStorage.getItem('userInfo') || '{}').userId || ''
  if (userId) {
    if (to.path === '/login') {
      next('/')
    } else {
      document.title = to.meta.title
      next()
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})