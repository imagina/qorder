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
        apiRoute: 'apiRoutes.qorder.items',
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
          suppliers: {
            type: 'select',
            props: {
              label: 'Proveedor',
              useInput: true,
              rules: [
                val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
              ]
            },
            loadOptions: {
              apiRoute: 'apiRoutes.quser.users',
              filterByQuery: true,
              select: {
                label: item => `${item.firstName} ${item.lastName}`,
                id: item => `${item.id}`
              }
            }
          }, 
          price: {
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.price')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          }
        },
        formRight: {
          quantity: {
            type: 'input',
            props: {
              label: `${this.$tr('isite.cms.form.units')}*`,
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
          }, 
          statusId: {
            type: 'select',
            props: {
              label: this.$tr('isite.cms.form.status'),
              useInput: true,
              rules: [
                val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
              ]
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qorder.statuses',
              requestParams: {
                filter: {
                  groupId: '2'
                }
              },
              select: {
                label: 'title',
                id: item => `${item.id}`
              }
            }
          }
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
