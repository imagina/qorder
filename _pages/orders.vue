<template>
  <div>
    <!-- orders -->
    <div class="q-px-md">
      <dynamicList ref="dynamicList" :listConfig="listConfig" @new="() => $refs.crudComponent.create()">
      </dynamicList>
    </div>

    <!--- show order modal --->
    <master-modal
      v-model="selectedRow.showModal"
      :title="`${this.$tr('iorder.cms.form.order')} : ${selectedRow.row?.orderId}`"
      custom-position
      @hide="selectedRow.showModal = false"
    >
      <order :id="selectedRow.row?.orderId" />
    </master-modal>

    <inner-loading :visible="loading" />
  </div>
</template>
<script>
//Components
import dynamicList from 'modules/qsite/_components/master/dynamicList';
import order from 'modules/qorder/_components/order/order.vue';
import {ITEM_STATUSES, ORDER_STATUSES} from 'src/modules/qorder/_components/status/constants';

export default {
  props: {},
  components: {
    dynamicList,
    order
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
          systemName: 'order.orders',
          tableProps: {
          },
          columns: [
            {
              name: 'id', label: this.$tr('iorder.cms.form.orderId'), field: 'orderId', style: '',
              onClick: (val, row) => this.showModal(row)
            },
            {
              name: 'title', label: this.$tr('isite.cms.form.product'), field: 'title',
              align: 'left', style: 'max-width: 250px',
              format: (val) => val || '-',
              onClick: (val, row) => this.showModal(row)
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
              },
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
              headerStyle: 'max-width: 160px !important;white-space: normal;word-wrap: break-word;',
              headerClasses: 'ellipsis-2-lines',
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
              name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status', align: 'center',
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
              /*
              dynamicField: row => {
                return {
                  type: 'select',
                  name: 'statusId',
                  //vIf: (row.statusId == ITEM_STATUSES.ITEM_PENDING) && !row.isLoading,
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
              }
              */

            },
            /* observations */
            {name: 'observations', label: this.$tr('iorder.cms.form.observations'), field: 'suppliers', align: 'center', style: 'width: 200px',
            format: (val) => {
                const result = []
                val.forEach(item => {
                  if(item?.comment) result.push(`${item.comment}`)
                });
                return result.join(', ')
              }
            },
            {
              name: 'supplyTotal', label: this.$tr('iorder.cms.form.totalProd'), field: 'suppliers', align: 'center',
              format: (val) => {
                const result = []
                val.forEach(item => {
                  if(item.supplyTotal) result.push(`$ ${item.supplyTotal}`)
                });
                return result.join(', ')
              }
            },
            {
              name: 'customCreatedAt', label: this.$tr('isite.cms.form.date'), field: 'order', align: 'center',
              format: val => val.customCreatedAt ? this.$trd(val.customCreatedAt, 'short') : '-'
            },
            {
              name: 'updatedAt', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val, 'short') : '-'
            },
            {
              name: 'actions', label: this.$tr('isite.cms.form.actions'),
              align: 'center'
            }

          ],
          requestParams: {
            include: 'suppliers.supplier,order',
            filter: {
              entityType: "Modules\\Iproduct\\Entities\\Product"
            }
          },
          filters: {
            orderId: {
              value: [],
              type: 'select',
              quickFilter: true,
              quickFilterClass: 'col',
              props: {
                label: this.$tr('iorder.cms.form.order'),
                clearable: true,
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qorder.orders',
                select: {
                  label: item => `${this.$tr('iorder.cms.form.orderId')} ${item.id}`,
                  id: item => `${item.id}`
                }
              }
            },

            /* products filter */
            entityId: {
              value: [],
              type: 'select',
              quickFilter: true,
              quickFilterClass: 'col',
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
              quickFilterClass: 'col',
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

            customCreatedAt: {
              value: {},
              quickFilter: true,
              quickFilterClass: 'col',
              type: 'dateRange',
              props: {
                label: this.$tr('isite.cms.form.date'),
                clearable: true,
                removeTime: true,
                autoClose: true,
                field: 'custom_created_at'
              }
            },

            statusId: {
              type: 'select',
              name: 'statusId',
              quickFilter: true,
              quickFilterClass: 'col',
              props: {
                label: this.$tr('isite.cms.form.status'),
                useInput: true,
                clearable: true,
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
        actions: [
          {
            icon: 'fa-light fa-circle-check',
            name: 'acceptItem',
            color: 'green',
            label: this.$tr('iorder.cms.label.acceptOrder'),
            vIf: ({ statusId, order }) => {
              const isPendingReview = statusId == ITEM_STATUSES.ITEM_PENDING_REVIEW || statusId == ITEM_STATUSES.ITEM_PENDING;
              const isCancelledWithValidOrder =
                statusId == ITEM_STATUSES.ITEM_CANCELLED &&
                order?.statusId &&
                (order.statusId == ORDER_STATUSES.ORDER_PENDING || order.statusId == ORDER_STATUSES.ORDER_IN_PROGRESS);

              return isPendingReview || isCancelledWithValidOrder;
            },
            action: (row) => {
              this.$alert.info({
                mode: 'modal',
                title: `ID: ${row.id} - ${row.title} `,
                message: this.$tr('iorder.cms.label.acceptMessage'),
                actions: [
                  { label: this.$tr('isite.cms.label.cancel'), color: 'grey' },
                  {
                    label: this.$tr('iorder.cms.label.acceptOrder'),
                    color: 'green',
                    handler: () => {
                      row.statusId = ITEM_STATUSES.ITEM_COMPLETED
                      this.updateRow(row)
                    }
                  }
                ]
              });
            }
          },
          {
            icon: 'fa-light fa-clock', // Icono que representa espera
            name: 'pendingItem',
            color: 'orange',
            label: this.$tr('iorder.cms.label.pendingItem'),
            vIf: ({ statusId, order }) => {
              const isPendingReview = statusId == ITEM_STATUSES.ITEM_PENDING_REVIEW;
              const isCancelledWithValidOrder =
                statusId == ITEM_STATUSES.ITEM_CANCELLED &&
                order?.statusId &&
                (order.statusId == ORDER_STATUSES.ORDER_PENDING || order.statusId == ORDER_STATUSES.ORDER_IN_PROGRESS);

              return isPendingReview || isCancelledWithValidOrder;
            },
            action: (row) => {
              this.$alert.info({
                mode: 'modal',
                title: `ID: ${row.id} - ${row.title} `,
                message: this.$tr('iorder.cms.label.pendingMessage'),
                actions: [
                  { label: this.$tr('isite.cms.label.cancel'), color: 'grey' },
                  {
                    label: this.$tr('iorder.cms.label.pendingItem'),
                    color: 'orange',
                    handler: () => {
                      row.statusId = ITEM_STATUSES.ITEM_PENDING;
                      this.updateRow(row);
                    }
                  }
                ]
              });
            }
          },
          {
            icon: 'fa-light fa-circle-xmark',
            name: 'refuseItem',
            color: 'red',
            label: this.$tr('iorder.cms.label.refuseOrder'),
            vIf: (row) => (row.statusId == ITEM_STATUSES.ITEM_PENDING || row.statusId == ITEM_STATUSES.ITEM_PENDING_REVIEW),
            action: (row) => {
              this.$alert.warning({
                mode: 'modal',
                title: `ID: ${row.id} - ${row.title} `,
                message: this.$tr('iorder.cms.label.refuseMessage'),
                actions: [
                  { label: this.$tr('isite.cms.label.cancel'), color: 'grey' },
                  {
                    label: this.$tr('iorder.cms.label.refuseOrder'),
                    color: 'red',
                    handler: () => {
                      row.statusId = ITEM_STATUSES.ITEM_CANCELLED
                      this.updateRow(row)
                    }
                  }
                ]
              });
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
    async updateRow(row){
			this.$refs.dynamicList.updateRow(row)
      this.selectedRow.showModal = false
		},
    showModal(row){
      this.selectedRow.row = row
      this.selectedRow.showModal = true
    }
  }
};
</script>
<style lang="scss">
.padding-none {
  padding: 0px !important;
}
</style>
