<template>
  <q-card flat dense>
    <q-card-section>
      <div class="row q-col-gutter-x-md">
        <div class="col q-row-gutter-y-md">
          <div v-if="order.status" class="text-body1 q-mb-md">{{ $tr('isite.cms.form.status') }}:
            <div outline :style="`color: ${order.status.color}`">
              <span :class="order.status.icon"></span>&nbsp;{{ order.status.title }}
            </div>
          </div>
          <div v-if="order.type" class="text-body1">{{ $tr('isite.cms.form.type') }}: {{ order.type.title }}</div>
          <div v-if="order.total > 0" class="text-body1">{{ $tr('iorder.cms.form.total') }}: ${{ order.total }}</div>
          <div v-if="order.createdAt" class="text-body2 q-mt-md">{{ $tr('isite.cms.form.createdAt') }}: {{ $trd(order.createdAt) }}</div>
          <div v-if="order.options?.externalCreatedAt" class="text-body2 q-mt-xs">
            {{ $tr('iorder.cms.label.externalCreatedAt') }}: {{ $trd(order.options?.externalCreatedAt) }}
          </div>
        </div>
      </div>
      <div class="row justify-start q-mt-md q-col-gutter-x-sm">
        <template
          v-for="action in actions"
          :key="action.name"
        >
          <div>
            <q-btn
              v-if="action.vIf(order)"
              v-bind="action"
              @click="action.action(order)"
              rounded
              no-caps
              unelevated
            />
          </div>
        </template>
      </div>
    </q-card-section>
    <q-separator/>
    <q-card-section v-if="order?.items">
      <!-- Order Items -->
      <dynamicList
        :loadPageActions="false"
        :listConfig="orderItems"
      />
    </q-card-section>
    <inner-loading :visible="loading" />
  </q-card>
</template>
<script lang="ts">
import {defineComponent} from 'vue';
import dynamicList from 'modules/qsite/_components/master/dynamicList';
import {ORDER_STATUSES} from "../status/constants";

export default defineComponent({
  props: {
    id: {default: null}
  },
  components: {
    dynamicList
  },
  mounted() {
    this.$nextTick(function () {
      this.init()
    });
  },
  data() {
    return {
      orderId: null,
      apiRoute: 'apiRoutes.qorder.orders',
      order: {},
      loading: false
    }
  },
  computed: {
    orderItems() {
      return {
        read: {
          tableProps: {
            dense: false
          },
          title: this.$tr('isite.cms.modal.products'),
          columns: [
            {
              name: 'title', label: this.$tr('isite.cms.form.product'), field: 'title',
              align: 'left', style: 'max-width: 250px',
              format: (val) => val || '-'
            },
            {
              name: 'suppliers', label: this.$tr('iorder.cms.form.supplier'), field: 'suppliers',
              align: 'center', style: 'max-width: 250px',
              format: (val) => {
                const result = []
                val.forEach(item => {
                  let label = `${item.supplier?.firstName || ''} ${item.supplier?.lastName || ''}`
                  if (label.length < 4) label = item.supplier.email
                  result.push(label)
                });

                return result.join(', ')
              },
            },
            /* providerPrice */
            {
              name: 'providerPrice',
              label: `$ ${this.$tr('iorder.cms.form.supplier')}`,
              field: 'suppliers',
              align: 'center',
              format: (val) => {
                const result = []
                val.forEach(item => {
                  if (item.price) result.push(`$${item.price}`)
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
                  if (item.price > row.price) icon = 'fa-solid fa-triangle-exclamation'
                });
                return {
                  template: 'status',
                  props: {
                    label: `$${row.price}`,
                    color: '#FF8C00',
                    icon
                  }
                }
              }
            },

            /* quantity: */
            /* add all amounts through suppliers */
            {
              name: 'quantity',
              label: this.$tr('iorder.cms.form.requestedAndAvaliableQuantity'),
              field: 'quantity',
              align: 'center',
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
                    label: `${row.quantity}/${quantity}`,
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
                    label: row.status.title,
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
            {
              name: 'observations',
              label: this.$tr('iorder.cms.form.observations'),
              field: 'suppliers',
              align: 'center',
              style: 'width: 200px',
              format: (val) => {
                const result = []
                val.forEach(item => {
                  if (item?.comment) result.push(`${item.comment}`)
                });
                return result.join(', ')
              }
            },
            {
              name: 'createdAt', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'left',
              format: val => val ? this.$trd(val, 'short') : '-'
            },
            {
              name: 'updatedAt', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'left',
              format: val => val ? this.$trd(val, 'short') : '-'
            }

          ],
          rows: this.order?.items || []
        }
      }
    },
    actions() {
      return [
        {
          icon: 'fa-light fa-circle-check',
          color: 'green',
          label: this.$tr('iorder.cms.label.acceptOrder'),
          vIf: (row) => (row.statusId == ORDER_STATUSES.ORDER_PENDING || row.statusId == ORDER_STATUSES.ORDER_IN_PROGRESS),
          action: (row) => {
            this.$alert.info({
              mode: 'modal',
              title: `${this.$tr('iorder.cms.form.order')}: ${row?.id}`,
              message: this.$tr('iorder.cms.label.acceptMessage'),
              actions: [
                {label: this.$tr('isite.cms.label.cancel'), color: 'grey'},
                {
                  label: this.$tr('iorder.cms.label.acceptOrder'),
                  color: 'green',
                  handler: () => {
                    const statusId = ORDER_STATUSES.ORDER_COMPLETED
                    this.updateOrder({...row, statusId})
                  }
                }
              ]
            });
          }
        },
        {
          icon: 'fa-light fa-circle-xmark',
          color: 'red',
          label: this.$tr('iorder.cms.label.refuseOrder'),
          vIf: (row) => (row.statusId == ORDER_STATUSES.ORDER_PENDING || row.statusId == ORDER_STATUSES.ORDER_IN_PROGRESS),
          action: (row) => {
            this.$alert.warning({
              mode: 'modal',
              title: `${this.$tr('iorder.cms.form.order')}: ${row?.id}`,
              message: this.$tr('iorder.cms.label.refuseMessage'),
              actions: [
                {label: this.$tr('isite.cms.label.cancel'), color: 'grey'},
                {
                  label: this.$tr('iorder.cms.label.refuseOrder'),
                  color: 'red',
                  handler: () => {
                    const statusId = ORDER_STATUSES.ORDER_CANCELLED
                    this.updateOrder({...row, statusId})
                  }
                }
              ]
            });
          }
        }
      ]
    }
  },
  methods: {
    init() {
      this.orderId = this.id || this.$route.params.id;
      this.getOrder();
    },
    async getOrder() {
      this.loading = true
      const requestParams = {
        params: {include: 'items.suppliers.supplier'},
        refresh: true
      }

      await this.$crud.show(this.apiRoute, this.orderId, requestParams).then(response => {
        this.loading = false;
        this.order = response.data
      }).catch(error => {
        this.$apiResponse.handleError(error, () => {
          this.loading = false;
        });
      });
    },
    async updateOrder(order) {
      this.loading = true
      await this.$crud.update(this.apiRoute, this.orderId, order).then(response => {
        this.$alert.info({message: `${this.$tr('isite.cms.message.recordUpdated')}`});
        this.order = {}
        this.getOrder();
      }).catch(error => {
        this.$alert.error({message: `${this.$tr('isite.cms.message.recordNoUpdated')}`});
        this.loading = false;
      });
    }
  },
})
</script>
<style lang="scss">
</style>
