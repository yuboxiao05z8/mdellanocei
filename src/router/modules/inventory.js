import Layout from '@/layout'

const inventoryRouter = [
  {
    path: '/Inventory',
    component: Layout,
    redirect: '/inventory/inventoryList',
    meta: { title: 'Inventory' },
    children: [
      {
        path: "inventoryList",
        component: () => import('@/views/inventory/inventoryList'),
        name: 'inventoryList',
        meta: { title: 'Inventory List', icon: 'el-icon-tickets' },
      },
      {
        path: "inventoryChildren",
        hidden: true,
        component: () => import('@/views/inventory/inventoryChildren'),
        name: 'inventoryChildren',
        meta: { title: 'Edit Item' },
        redirect: '/Inventory/inventoryChildren/detail',
        children: [
          {
            path: "detail",
            component: () => import('@/views/inventory/inventoryChildren/detail'),
            name: 'detail',
            meta: { title: 'Detail' }
          },
          {
            path: "buildingPhases",
            component: () => import('@/views/inventory/inventoryChildren/buildingPhases'),
            name: 'buildingPhases',
            meta: { title: 'Building Phases' }
          },
          {
            path: "floorPlans",
            component: () => import('@/views/inventory/inventoryChildren/floorPlans/index'),
            name: 'floorPlans',
            meta: { title: 'Floor Plans' },
            redirect: '/Inventory/inventoryChildren/floorPlans/floorPlan',
            children: [
              {
                path: "floorPlan",
                component: () => import('@/views/inventory/inventoryChildren/floorPlans/floorPlans'),
                name: 'floorPlan',
                meta: { title: 'floor Plan' }
              },
              {
                path: "PDIFilesList",
                component: () => import('@/views/inventory/inventoryChildren/floorPlans/PDIFilesList'),
                name: 'PDIFilesList',
                meta: { title: 'PDI Files List' }
              }
            ]

          },
          {
            path: "units",
            component: () => import('@/views/inventory/inventoryChildren/units'),
            name: 'units',
            meta: { title: 'Units' }
          },
          {
            path: "plan",
            component: () => import('@/views/inventory/inventoryChildren/mapping/plan'),
            name: 'plan',
            meta: { title: 'Plan' }
          },
          {
            path: "media",
            component: () => import('@/views/inventory/inventoryChildren/media/media'),
            name: 'media',
            meta: { title: 'Media' },
            redirect: '/Inventory/inventoryChildren/media/image',
            children: [
              {
                path: "image",
                component: () => import('@/views/inventory/inventoryChildren/media/image'),
                name: 'image',
                meta: { title: 'Image' }
              },
              {
                path: "pdf",
                component: () => import('@/views/inventory/inventoryChildren/media/pdf'),
                name: 'pdf',
                meta: { title: 'Pdf' }
              },
              {
                path: "video",
                component: () => import('@/views/inventory/inventoryChildren/media/video'),
                name: 'video',
                meta: { title: 'Video' },

              },
              {
                path: "aeriaView",
                component: () => import('@/views/inventory/inventoryChildren/media/aeriaView'),
                name: 'aeriaView',
                meta: { title: 'Aeria View' }
              },
            ]
          },
          {
            path: "settings",
            component: () => import('@/views/inventory/inventoryChildren/setTing/index'),
            name: 'settings',
            meta: { title: 'Settings' },
            redirect: '/Inventory/inventoryChildren/settings/GeneralSettings',
            children: [
              {
                path: "GeneralSettings",
                component: () => import('@/views/inventory/inventoryChildren/setTing/GeneralSettings'),
                name: 'GeneralSettings',
                meta: { title: 'General Settings' }
              },
              {
                path: "commission",
                component: () => import('@/views/inventory/inventoryChildren/setTing/commission'),
                name: 'commission',
                meta: { title: 'commission' }
              },

              {
                path: "PromoSettings",
                component: () => import('@/views/inventory/inventoryChildren/setTing/PromoSettings'),
                name: 'PromoSettings',
                meta: { title: 'Promo Settings' }
              },
              {
                path: "contactInformation",
                component: () => import('@/views/inventory/inventoryChildren/setTing/contactInformation'),
                name: 'contactInformation',
                meta: { title: 'Contact In Formation' }
              },
              {
                path: "CustomSettings",
                component: () => import('@/views/inventory/inventoryChildren/setTing/CustomSettings'),
                name: 'CustomSettings',
                meta: { title: 'Custom Settings' }
              },
            ]
          },
          {
            path: "permissions",
            component: () => import('@/views/inventory/inventoryChildren/permissions'),
            name: 'permissions',
            meta: { title: 'Permissions' }
          },
          {
            path: "documentGeneration",
            component: () => import('@/views/inventory/inventoryChildren/documentGeneration'),
            name: 'documentGeneration',
            meta: { title: 'Document Generation' }
          },
          {
            path: "editMap",
            component: () => import('@/views/inventory/inventoryChildren/mapping/editMap'),
            name: 'editMap',
            meta: { title: 'Edit Map' },
            hidden: true,
          },
        ]
      },
      {
        path: "booking",
        hidden: true,
        component: () => import('@/views/inventory/AppointmentBooking/booking'),
        name: 'booking',
        type: ['Developers'],
        meta: { title: 'Appointment Booking' },
      }
    ]
  }
]

export default inventoryRouter