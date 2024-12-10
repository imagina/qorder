import pages from 'src/setup/pages'

//task
export default [
    {
      title: 'iorder.cms.sidebar.adminGroup', //store
      icon: 'fa-light fa-receipt',
      children: [
        pages.qorder.orders,
        pages.qorder.suppliers
      ]
    },
  ]
