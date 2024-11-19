<template>
  <div>
    <!-- tasks -->
    <div class="q-px-md">
      <dynamicList ref="dynamicList" :listConfig="listConfig" @new="() => $refs.crudComponent.create()">
      </dynamicList>
    </div>

    <!-- crud form -->
    <crud ref="crudComponent" :type="null" :crud-data="import('modules/qtask/_crud/tasks')"
      @created="refreshDynamicList()" @updated="refreshDynamicList()" @deleted="refreshDynamicList()" />

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
        //apiRoute: 'apiRoutes.qorder.orders',
        apiRoute: 'https://nflow3.imaginacolombia.com/webhook/waruwa-orders',
        permission: '',
        pageActions: {
          extraActions: ['search', 'new', 'export']
        },
        read: {
          title: this.$tr('iorder.cms.orderManagement'),
          tableProps: {
          },
          columns: [
            {
              name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: '',
              onClick: (val, row) => this.openShowModal(row)
            },
            {
              name: 'title', label: 'Producto', field: 'title',
              align: 'left', style: 'max-width: 250px',
              onClick: (val, row) => this.openShowModal(row)
            },
            {
              name: 'providerName', label: 'Proveedor', field: 'providerName',
              align: 'center', style: 'max-width: 250px',
              format: (val) => val ? val : '-'              
            },
            /* providerPrice */
            {
              name: 'providerPrice', label: '$ Proveedor', field: 'providerPrice', align: 'center',
              //format: (val, row) => row?.status ? row.status.title : '---',              
              contentType: (row) => {
                return {
                  template: 'status',
                  props: {
                    label:  `$${row.providerPrice.value}`,
                    color: row.providerPrice.color,
                    icon: row.providerPrice.icon
                  }
                }              
              },
              dynamicField: {
                type: 'select',
                
                props: {
                  label: this.$tr('isite.cms.form.status'),
                  useInput: true,
                  rules: [
                    val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                  ]
                },
                loadOptions: {
                  //apiRoute: 'apiRoutes.qproduct.statuses',
                  apiRoute: 'https://nflow3.imaginacolombia.com/webhook/waruwa-status',
                  select: {
                    label: 'title',
                    id: item => `${item.id}`
                  }
                }
              }
            },
            /* price */
            {
              name: 'price', label: '$ Waruwa', field: 'price', align: 'center',
              //format: (val, row) => row?.status ? row.status.title : '---',              
              contentType: (row) => {
                return {
                  template: 'status',
                  props: {
                    label:  `$${row.price}`
                  }
                }              
              },
              dynamicField: {
                type: 'select',
                
                props: {
                  label: this.$tr('isite.cms.form.status'),
                  useInput: true,
                  rules: [
                    val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                  ]
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.qproduct.statuses',
                  select: {
                    label: 'title',
                    id: item => `${item.id}`
                  }
                }
              }
            },
            /* units */
            {
              name: 'units', label: 'Unidades Sol/Disp', field: 'units', align: 'center',
              //format: (val, row) => row?.status ? row.status.title : '---',              
              contentType: (row) => {
                return {
                  template: 'status',
                  props: {
                    label:  `${row.units.requested}/${row.units.avaliable}`,
                    color: '#FF8C00',
                    icon: row.units.requested > row.units.avaliable ? 'fa-light fa-triangle-exclamation' : ''
                  }
                }              
              },
              dynamicField: {
                type: 'select',
                
                props: {
                  label: this.$tr('isite.cms.form.status'),
                  useInput: true,
                  rules: [
                    val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                  ]
                },
                loadOptions: {
                  apiRoute: 'apiRoutes.qproduct.statuses',
                  select: {
                    label: 'title',
                    id: item => `${item.id}`
                  }
                }
              }
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
                
                props: {
                  label: this.$tr('isite.cms.form.status'),
                  useInput: true,
                  rules: [
                    val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                  ]
                },
                loadOptions: {
                  //apiRoute: 'apiRoutes.qproduct.statuses',
                  apiRoute: 'https://nflow3.imaginacolombia.com/webhook/waruwa-status',
                  select: {
                    label: 'title',
                    id: item => `${item.id}`
                  }
                }
              }
            },
            /* observations */
            {name: 'observations', label: this.$tr('isite.cms.form.observations'), field: 'observations', align: 'center', style: 'width: 200px'},
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'),
              align: 'center'
            }
          ],
          requestParams: {},
          filters: {
            product: {
              value: [],
              type: 'select',
              quickFilter: true,
              props: {
                label: 'product',
                //multiple: true,
                //useChips: true,
                useInput: true,
                rules: [
                  val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                ],
              },
              loadOptions: {
                apiRoute: 'apiRoutes.quser.users',              
                select: {
                  label: 'email',
                  id: item => `${item.id}`                
                }
              }
            },
            provider: {
              value: [],
              type: 'select',
              quickFilter: true,
              props: {
                label: 'provider',
                //multiple: true,
                //useChips: true,
                useInput: true,
                rules: [
                  val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                ],
              },
              loadOptions: {
                apiRoute: 'apiRoutes.quser.users',              
                select: {
                  label: 'email',
                  id: item => `${item.id}`                
                }
              }
            },
            createdAt: {
              value: '',
              quickFilter: true,                          
              type: 'date',
              props: {
                label: this.$tr('isite.cms.form.createdAt')
              }
            },
            status: {
              value: [],
              type: 'select',
              quickFilter: true,
              props: {
                label: 'status',
                //multiple: true,
                //useChips: true,
                useInput: true,
                rules: [
                  val => !!val?.length || this.$tr('isite.cms.message.fieldRequired')
                ],
              },
              loadOptions: {                
                //apiRoute: 'apiRoutes.quser.users',
                apiRoute: 'https://nflow3.imaginacolombia.com/webhook/waruwa-status',
                select: {
                  label: 'title',
                  id: item => `${item.id}`                
                }
              }
            },
          },

          help: {
            title: this.$tr('itask.cms.taskManagement'),
            description: this.$tr('itask.cms.taskManagement')
          }

        },
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
