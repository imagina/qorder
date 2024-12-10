<template>
  <div>
    <!-- tasks -->
    <div class="q-px-md">
      <dynamicList ref="dynamicList" :listConfig="listConfig" @new="() => $refs.crudComponent.create()">
      </dynamicList>
    </div>

    <!-- crud form -->
    <crud 
      v-if="false"
      ref="crudComponent" 
      :type="null" 
      :crud-data="import('modules/qorder/_crud/orders')"
      @created="refreshDynamicList()" 
      @updated="refreshDynamicList()" 
      @deleted="refreshDynamicList()" />
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
        //permission: 'iorder.orders.manage',
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
              //onClick: (val, row) => this.openShowModal(row)
            },
            {
              name: 'title', label: 'Producto', field: 'title',
              align: 'left', style: 'max-width: 250px',
              format: (val) => val || '-',
            },
            {
              name: 'suppliers', label: 'Proveedor', field: 'suppliers',
              align: 'center', style: 'max-width: 250px',
              format: (val) => {                
                const result = []
                val.forEach(item => {
                  let label =  `${item.supplier?.firstName || ''} ${item.supplier?.lastName || ''}`
                  if(label.length < 4) label = item.supplier.email
                  result.push(label)
                });

                return result.join(', ')
              },
              /*
              dynamicField: {
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
              }
              */
            },
            /* providerPrice */            
            {
              name: 'providerPrice', label: '$ Proveedor', field: 'suppliers', align: 'center',
              format: (val) => {                
                const result = []
                val.forEach(item => {                  
                  if(item.price) result.push(`$${item.price}`)
                });
                return result.join(', ')
              },
            },
            
            /* price */
            {
              name: 'price', label: '$ Waruwa', field: 'price', align: 'center',
              format: (val) => `$${val}` || '-',
              contentType: (row) => {                
                let icon = ''
                row.suppliers.forEach(item => {
                  if(item.price > row.price) icon = 'fa-light fa-triangle-exclamation' 
                });
                return {
                  template: 'status',
                  props: {
                    label:  `$${row.price}`,
                    color: '#FF8C00',
                    icon
                  }
                }              
              },
              /*
              dynamicField: {
                type: 'input',
                props: {
                  label: `${this.$tr('isite.cms.form.price')}*`,
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired')
                  ],
                },
              }
                */
            },
          
            /* quantity: */
           /* add all amounts through suppliers */
            {
              name: 'quantity', label: 'Unidades Sol/Disp', field: 'quantity', align: 'center',
              contentType: (row) => {                
                let quantity = 0
                row.suppliers.forEach(item => {
                  quantity += item.quantity
                })

                const icon = row.quantity > quantity ? 'fa-light fa-triangle-exclamation' : ''
                return {
                  template: 'status',
                  props: {
                    label:  `${row.quantity}/${quantity}`,
                    color: '#FF8C00',
                    icon                
                  }
                }              
              },
              /*
              dynamicField: {
                type: 'input',
                props: {
                  label: `${this.$tr('isite.cms.form.units')}*`,
                  rules: [
                    val => !!val || this.$tr('isite.cms.message.fieldRequired')
                  ],
                },
              }
                */
            },
            
            /* status */
            {
              name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status', align: 'center', style: 'width: 250px',
              //format: (val, row) => row?.status ? row.status.title : '---',              
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
            {name: 'observations', label: this.$tr('isite.cms.form.observations'), field: 'observations', align: 'center', style: 'width: 200px'},
            /*
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'),
              align: 'center'
            }
              */
          ],
          requestParams: {
            include: 'suppliers.supplier',
          },
          filters: {
            orderId: {
              value: [],
              type: 'select',
              quickFilter: true,
              props: {
                label: "Order",
                //multiple: true,
                //useChips: true,
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
            
            suppliers: {
              value: [],
              type: 'select',
              quickFilter: true,
              props: {
                label: 'suppliers',
                multiple: true,
                //useChips: true,
                useInput: true,
                clearable: true,
              },
              loadOptions: {
                apiRoute: 'apiRoutes.quser.users',
                filterByQuery: true,
                select: {
                  label: 'email',
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

          help: {
            title: this.$tr('itask.cms.taskManagement'),
            description: this.$tr('itask.cms.taskManagement')
          }

        },
        /*
        actions: [
          {//show action
            icon: 'fa-light fa-eye',
            name: 'edit',
            label: this.$tr('isite.cms.label.show'),
            action: (item) => {
              this.onUpdate(item);
            }
          },
          {//Edit action
            icon: 'fa-light fa-pencil',
            name: 'edit',
            label: this.$tr('isite.cms.label.edit'),
            action: (item) => {
              this.onUpdate(item);
            }
          },
          {//Delete action
            icon: 'fa-light fa-trash-can',
            name: 'delete',
            label: this.$tr('isite.cms.label.delete'),
            action: (item) => {
              this.onDelete(item);
            }
          }
        ]
          */
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
    },

    async reloadRow(row) {
      const newRow = await this.$refs.dynamicList.reloadRow(row);
      this.selectedRow.row = newRow;
    },
    openShowModal(row) {
      this.selectedRow.row = row;
      this.selectedRow.showModal = true;
    },
    onUpdate(row) {
      this.$refs.crudComponent.update(row);
    },
    onDelete(row) {
      this.$refs.crudComponent.delete(row);
    }
  }
};
</script>
<style lang="scss">
.padding-none {
  padding: 0px !important;
}
</style>
