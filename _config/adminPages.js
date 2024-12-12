
export default {
  orders: {
    permission: 'iorder.orders.manage',
    activated: true,
    authenticated: true,
    path: '/orders/orders/index',
    name: 'qorder.admin.orders',
    page: () => import('modules/qorder/_pages/orders'),
    layout: () => import('layouts/master.vue'),
    title: 'iorder.cms.sidebar.adminOrders',
    icon: 'fa-light fa-receipt',
    subHeader: {
        refresh: true,
    }
  },

  supplies: {
    permission: 'iorder.suppliers.manage',
    activated: true,
    authenticated: true,
    path: '/orders/supplies/index',
    name: 'qorder.admin.supplies',
    page: () => import('modules/qorder/_pages/supplies'),
    layout: () => import('layouts/master.vue'),
    title: 'iorder.cms.sidebar.adminSupplies',
    icon: 'fa-light fa-truck-field',
    subHeader: {
      refresh: true,
    }
  }
}


