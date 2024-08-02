import Vue from 'vue'
import Router from 'vue-router'
import {
  Notification
} from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/home',
      component: resolve => {
        require(['@/views/home.vue'], resolve)
      },
      children: [{
          path: "/home/inventoryList.html",
          component: resolve => {
            require(['../views/inventory/inventoryList'], resolve)
          }
        },
        {
          path: "/home/inventoryChildren.html",
          component: resolve => {
            require(['../views/inventory/inventoryChildren'], resolve)
          },
          children: [{
              path: "/home/detail.html",
              component: resolve => {
                require(['../views/inventory/inventoryChildren/detail'], resolve)
              }
            },
            {
              path: "/home/buildingPhases.html",
              component: resolve => {
                require(['../views/inventory/inventoryChildren/buildingPhases'], resolve)
              }
            },
            {
              path: "/home/floorPlans.html",
              component: resolve => {
                require(['../views/inventory/inventoryChildren/floorPlans'], resolve)
              }
            },
            {
              path: "/home/units.html",
              component: resolve => {
                require(['../views/inventory/inventoryChildren/units'], resolve)
              }
            },
            {
              path: "/home/plan.html",
              component: resolve => {
                require(['../views/inventory/inventoryChildren/mapping/plan'], resolve)
              }
            },
            {
              path: "/home/image.html",
              component: resolve => {
                require(['../views/inventory/inventoryChildren/media/image'], resolve)
              }
            },
            {
              path: "/home/pdf.html",
              component: resolve => {
                require(['../views/inventory/inventoryChildren/media/pdf'], resolve)
              }
            },
            {
              path: "/home/video.html",
              component: resolve => {
                require(['../views/inventory/inventoryChildren/media/video'], resolve)
              }
            },
            {
              path: "/home/aeriaView.html",
              component: resolve => {
                require(['../views/inventory/inventoryChildren/media/aeriaView'], resolve)
              }
            },

            // {
            //   path: "/home/email.html",
            //   component: resolve => {
            //     require(['../views/inventory/inventoryChildren/email'], resolve)
            //   }
            // },
            {
              path: "/home/commission.html", // 销售设置
              component: resolve => {
                require(['../views/inventory/inventoryChildren/setTing/commission'], resolve)
              }
            },
            {
              path: "/home/GeneralSettings.html", // 通用设置
              component: resolve => {
                require(['../views/inventory/inventoryChildren/setTing/GeneralSettings'], resolve)
              }
            },
            {
              path: "/home/contactInformation.html", // 联系人设置
              component: resolve => {
                require(['../views/inventory/inventoryChildren/setTing/contactInformation'], resolve)
              }
            },
            {
              path: "/home/CustomSettings.html", // 自定义设置
              component: resolve => {
                require(['../views/inventory/inventoryChildren/setTing/CustomSettings'], resolve)
              }
            },
            {
              path: "/home/permissions.html",
              component: resolve => {
                require(['../views/inventory/inventoryChildren/permissions'], resolve)
              }
            },
            {
              path: "/home/documentGeneration.html",
              component: resolve => {
                require(['../views/inventory/inventoryChildren/documentGeneration'], resolve)
              }
            },
            {
              path: "/",
              redirect: "/home/detail.html"
            }
          ]
        },

        
        {
          path: "/home/editMap.html",
          component: resolve => {
            require(['../views/inventory/inventoryChildren/mapping/editMap'], resolve)
          }
        },
        {
          path: "/home/notification.html",
          component: resolve => {
            require(['../views/notification/notification'], resolve)
          }
        },
        {
          path: "/home/interest.html",
          component: resolve => {
            require(['../views/interest/interest'], resolve)
          }
        },
        {
          path: "/home/transactions.html",
          component: resolve => {
            require(['../views/transactions/transactions'], resolve)
          }
        },
        {
          path: "/home/versionList.html",
          component: resolve => {
            require(['../views/versionManage/versionList'], resolve)
          }
        },
        {
          path: "/home/editVersion.html",
          component: resolve => {
            require(['../views/versionManage/editVersion'], resolve)
          }
        },
        {
          path: "/home/accountLists.html",
          component: resolve => {
            require(['../views/accounts/accountLists'], resolve)
          }
        },
        {
          path: "/home/employeeList.html",
          component: resolve => {
            require(['../views/accounts/employeeList'], resolve)
          }
        },
        {
          path: "/home/calendar.html",
          component: resolve => {
            require(['../views/calendar/calendar'], resolve)
          }
        },
        {
          path: "/home/generalFiles.html",
          component: resolve => {
            require(['../views/admin/generalFiles'], resolve)
          }
        },
        {
          path: "/home/auditLogs.html",
          component: resolve => {
            require(['../views/admin/auditLogs'], resolve)
          }
        },
        {
          path: "/home/userList.html",
          component: resolve => {
            require(['../views/admin/userManagement/userList'], resolve)
          }
        },
        {
          path: "/home/createNewUsers.html",
          component: resolve => {
            require(['../views/admin/userManagement/createNewUsers'], resolve)
          }
        },
        {
          path: "/home/teams.html",
          component: resolve => {
            require(['../views/admin/userManagement/teams'], resolve)
          }
        },
        {
          path: "/home/createNewTeams.html",
          component: resolve => {
            require(['../views/admin/userManagement/createNewTeams'], resolve)
          }
        },
        {
          path: "/home/roles.html",
          component: resolve => {
            require(['../views/admin/userManagement/roles'], resolve)
          }
        },
        {
          path: "/home/otherSellingEntities.html",
          component: resolve => {
            require(['../views/admin/masterDataManagement/otherSellingEntities'], resolve)
          }
        },
        {
          path: "/home/report.html",
          component: resolve => {
            require(['../views/admin/report'], resolve)
          }
        },
        {
          path: "/home/changePassword.html",
          component: resolve => {
            require(['../views/password/changePassword'], resolve)
          }
        },
        {
          path: "/home/copyProject.html",
          component: resolve => {
            require(['../views/copyProject/copyProject'], resolve)
          }
        },
        {
          path: "/home/feedback.html",
          component: resolve => {
            require(['../views/feedback/feedback'], resolve)
          }
        },
        {
          path: "/",
          redirect: "/home/inventoryList.html"
        },
        {
          path: "/home/email.html",
          component: resolve => {
            require(['../views/allocation/email'], resolve)
          }
        },
      ]
    },
    {
      name: "login",
      path: '/',
      component: resolve => {
        require(['../views/login/login'], resolve)
      }
    }
  ]
})
// 路由跳转是判断用户是否登录
router.beforeEach((to, from, next) => {
  let userInfo = window.sessionStorage.getItem('userInfo')
  userInfo = userInfo ? JSON.parse(userInfo) : {}
  if (to.path !== '/' && (userInfo.userName === '' || userInfo.userName === undefined)) {
    const lang = sessionStorage.getItem("lang");
    if (!lang || lang === "zh-CN") {
      Notification({
        title: '警告',
        message: '账号未登录',
        type: 'warning'
      })
    } else {
      Notification({
        title: 'warning',
        message: 'Account not registered',
        type: 'warning'
      })
    }
    next('/')
  } else {
    if (to.path == "/") { //如果跳转的页面是login
      if (from.path == "/") { //如果当前的页面是login
        history.pushState(null, null, document.URL);
        window.addEventListener("popstate", function () { //开启返回按钮的监听
          history.pushState(null, null, document.URL);
        });
        next()
      } else {

        if (to.params.isOut) { //这里判断是否是退出页面
          next()
        } else {
          next(false)
        }

      }
    } else { //如果跳转的不是login
      // window.removeEventListener('popstate', function () {//移除返回按钮的监听
      //   history.pushState(null, null, document.URL);
      // })
      next()

    }
  }
})
export default router
