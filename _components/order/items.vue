<template>
    <q-card flat dense>
      <q-card-section>
        <div class="row q-col-gutter-x-md">
          <div v-if="mainImage">
            <q-avatar square size="224px" >
              <img :src="mainImage" />
            </q-avatar>
          </div>
          <div class="col q-row-gutter-y-md">
            <div class="text-h5 q-my-md">{{ row.title }}</div>
            <div class="text-body1 q-mb-md">{{ $tr('isite.cms.form.status') }}:
               <div outline :style="`color: ${row.status.color}`">
                <span :class="row.status.icon"></span>&nbsp;{{ row.status.title }}
               </div>
            </div>
            <div class="text-body1">{{ $tr('iorder.cms.form.requestedQuantity') }}: {{ row.quantity }}</div>
            <div class="text-body1">{{ $tr('iorder.cms.form.price') }}: ${{row.price}}</div>
            <div class="text-body1">{{ $tr('iorder.cms.form.total') }}: ${{row.total}}</div>
            <div class="text-body2 q-mt-md">{{ $tr('isite.cms.form.createdAt') }}: {{ $trd(row.createdAt) }}</div>
          </div>
        </div>
        <div class="row justify-start q-mt-md q-col-gutter-x-sm">
          <template
            v-for="action in actions"
            :key="action.name"
          >
            <div>
              <q-btn
                v-if="action.vIf(row)"
                v-bind="action"
                @click="action.action(row)"
                rounded
                no-caps
                unelevated
              />
            </div>
          </template>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <!-- suppliers -->
        <dynamicList
          :loadPageActions="false"
          :listConfig="suppliers"
        />
      </q-card-section>
    </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import dynamicList from 'modules/qsite/_components/master/dynamicList';

export default defineComponent({
  props: {
    row: { default: {} },
    actions: { default: [] },
  },
  components: {
    dynamicList
  },
  computed: {
    mainImage(){
      return this.row?.extraData?.mediaFiles?.mainimage?.url || false
    },
    suppliers(){
      return {        
        read: {
          tableProps: {
            dense: false
          },
          title: this.$tr('iorder.cms.form.suppliers'),
          columns: [
            { name: "id", align: "left", label: this.$tr('isite.cms.form.id'), field: "supplier", 
              format: val => `<a href="${val.url}" target="_blank">${val.id}</a>`
            },
            
            { name: "supplier", align: "left", label: this.$tr('iorder.cms.form.supplier'), field: "supplier", 
              format: val => `${val.firstName} ${val.lastName}`
            },
            { name: "status", align: "center", label: this.$tr('isite.cms.form.status'), field: "status",
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
            },
            { name: "quantity", align: "center", label: this.$tr('iorder.cms.form.requestedAndAvaliableQuantity'), field: "quantity", 
              contentType: (row) => {
                  const icon = this.row.quantity > row.quantity ? 'fa-solid fa-triangle-exclamation' : ''
                  return {
                    template: 'status',
                    props: {
                      label:  `${this.row.quantity}/${row.quantity}`,
                      color: '#FF8C00',
                      icon
                    }
                  }
                }
              },

            { name: "price", align: "center", label: this.$tr('iorder.cms.form.price'), field: "price",
              format: val => `$${val}`,
              contentType: (row) => {
                const icon = row.price > this.row.price ? 'fa-solid fa-triangle-exclamation' : ''
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
            { name: "total", align: "center", label: this.$tr('iorder.cms.form.total'), field: "total", 
              format: val => `$${val}`
            },        
            { name: "comment", align: "left", label: this.$tr('iorder.cms.form.observations'), field: "comment" },
            { name: "createdAt", align: "left", label: this.$tr('isite.cms.form.createdAt'), field: "createdAt", 
              format: val => this.$trd(val)
            },        
          ], 
          rows: this.row?.suppliers || []
        }
      }
    }
  },
  methods: {}
})
</script>
<style lang="scss">
</style>