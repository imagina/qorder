<template>
  <div>
    <!-- orders -->
    <div class="q-px-md">
      <dynamicList ref="dynamicList" :listConfig="listConfig" @new="() => $refs.crudComponent.create()">
      </dynamicList>
    </div>
    <inner-loading :visible="loading" />
  </div>
</template>
<script>
//Components
import dynamicList from 'modules/qsite/_components/master/dynamicList';

export default {
  props: {},
  components: {
    dynamicList
  },
  watch: {},
  mounted() {
    this.$nextTick(function () {
      //this.init()
    });
  },
  data() {
    return {
      selectedRow: {
        timeLogsModal: false,
        showModal: false,
        row: null
      },
      loading: false,
      listConfig: {
        apiRoute: 'apiRoutes.qorder.items',
        pageActions: {
          extraActions: ['search', 'export']
        },
        read: {
          title: this.$tr('iorder.cms.orderManagement'),
          tableProps: {
          },
          columns: [
            {
              name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: '',
            },
            {
              name: 'title', label: this.$tr('isite.cms.form.product'), field: 'title',
              align: 'left', style: 'max-width: 250px',
              format: (val) => val || '-',
            },
            {
              name: 'suppliers', label: this.$tr('iorder.cms.form.supplier'), field: 'suppliers',
              align: 'center', style: 'max-width: 250px',
              format: (val) => {
                const result = []
                val.forEach(item => {
                  let label =  `${item.supplier?.firstName || ''} ${item.supplier?.lastName || ''}`
                  if(label.length < 4) label = item.supplier.email
                  result.push(label)
                });

                return result.join(', ')
              }
            },
            /* providerPrice */
            {
              name: 'providerPrice', label: `$ ${this.$tr('iorder.cms.form.supplier')}`, field: 'suppliers', align: 'center',
              format: (val) => {
                const result = []
                val.forEach(item => {
                  if(item.price) result.push(`$${item.price}`)
                });
                return result.join(', ')
              }
            },
            /* price */
            {
              name: 'price', label: `$ ${this.$tr('iorder.cms.form.price')}`, field: 'price', align: 'center',
              format: (val) => `$${val}` || '-',
              contentType: (row) => {
                let icon = ''
                row.suppliers.forEach(item => {
                  if(item.price > row.price) icon = 'fa-solid fa-triangle-exclamation'
                });
                return {
                  template: 'status',
                  props: {
                    label:  `$${row.price}`,
                    color: '#FF8C00',
                    icon
                  }
                }
              }
            },

            /* quantity: */
           /* add all amounts through suppliers */
            {
              name: 'quantity', label: this.$tr('iorder.cms.form.requestedAndAvaliableQuantity'), field: 'quantity', align: 'center',
              headerStyle: 'max-width: 200px !important',
              headerClasses: 'ellipsis',
              contentType: (row) => {
                let quantity = 0
                row.suppliers.forEach(item => {
                  quantity += item.quantity
                })

                const icon = row.quantity > quantity ? 'fa-solid fa-triangle-exclamation' : ''
                return {
                  template: 'status',
                  props: {
                    label:  `${row.quantity}/${quantity}`,
                    color: '#FF8C00',
                    icon
                  }
                }
              }
            },

            /* status */
            {
              name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status', align: 'center', style: 'width: 250px',
              contentType: (row) => {
                return {
                  template: 'status',
                  props: {
                    label:  row.status.title,
                    color: row.status.color,
                    icon: row.status.icon
                  }
                }
              },
              dynamicField: {
                type: 'select',
                name: 'statusId',
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
            /* observations */
            {name: 'observations', label: this.$tr('iorder.cms.form.observations'), field: 'observations', align: 'center', style: 'width: 200px'},
            {
              name: 'createdAt', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val) : '-'
            },
            {
              name: 'updatedAt', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val) : '-'
            }

          ],
          requestParams: {
            include: 'suppliers.supplier',
            filter: {
              entityType: "Modules\\Iproduct\\Entities\\Product"
            }
          },
          filters: {
            orderId: {
              value: [],
              type: 'select',
              quickFilter: true,
              props: {
                label: this.$tr('iorder.cms.form.order'),
                clearable: true,
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qorder.orders',
                select: {
                  label: item => `${item.id} - ${item.createdAt}`,
                  id: item => `${item.id}`
                }
              }
            },

            /* products filter */
            entityId: {
              value: [],
              type: 'select',
              quickFilter: true,
              props: {
                label: this.$tr('isite.cms.form.product'),
                useInput: true,
                clearable: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qproduct.products',
                filterByQuery: true,
                select: {
                  label: 'title',
                  id: item => `${item.id}`
                }
              }
            },

            'suppliers.supplierId': {
              value: [],
              type: 'select',
              quickFilter: true,
              props: {
                label: this.$tr('iorder.cms.form.supplier'),
                useInput: true,
                clearable: true
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

            statusId: {
              type: 'select',
              name: 'statusId',
              quickFilter: true,
              props: {
                label: this.$tr('isite.cms.form.status'),
                useInput: true,
                clearable: true,
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

          /*
          help: {
            title: this.$tr('itask.cms.taskManagement'),
            description: this.$tr('itask.cms.taskManagement')
          }
          */

        },
      }
    };
  },
  computed: {},
  methods: {
    init() {
    },
    refreshDynamicList() {
      this.selectedRow.showModal = false;
      this.selectedRow.row = null;
      this.$refs.dynamicList.getData({ page: 1 }, true);
    }
  }
};
</script>
<style lang="scss">
.padding-none {
  padding: 0px !important;
}
</style>
