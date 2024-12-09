<template></template>
<script>

export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qorder.entityNames.orders"),
        apiRoute: 'apiRoutes.qorder.orders',
        permission: 'iorder.orders',
        create: {
          title: this.$tr('iorder.cms.newOrder'),
        },
        read: {
          columns: [],
          requestParams: {
            include: 'suppliers.supplier',
          },
        },
        update: {
          title: this.$tr('iorder.cms.updateOrder'),
          requestParams: {
            include: 'suppliers.supplier',
          },
        },
        delete: true,
        formLeft: {
          id: { value: '' },
          userId: { value: this.$store.state.quserAuth.userId },
          title: {
            value: '',
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.title')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          },
          
         
        },
        formRight: {
          /* status */          
        },
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  },
}
</script>
