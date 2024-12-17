<template>
    <q-card
      flat
      dense
    >
      <!-- Datos del Producto -->
      <q-card-section>
        <div class="row q-col-gutter-x-md">
          <div v-if="mainImage">
            <q-avatar square size="224px" >
              <img :src="mainImage" />
            </q-avatar>
          </div>
          <div class="col q-row-gutter-y-md">
            <div class="text-h5 q-my-md">{{ row.title }}</div>

            <div class="text-body1">{{ $tr('iorder.cms.form.requestedQuantity') }}: {{ row.quantity }}</div>
            <div class="text-body1">Precio: ${{row.price}}</div>
            <div class="text-body1">total: ${{row.total}}</div>
            <div class="text-body1">fecha: {{ $trd(row.createdAt) }}</div>
            <div class="text-body1">Estado: {{ row.status.title }}</div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <!-- Detalles Extra -->
      <q-card-section>
        <div class="text-h6">{{ this.$tr('iorder.cms.form.suppliers') }}</div>
        <q-table
          :rows="suppliers.rows"
          :columns="suppliers.columns"
          row-key="id"
          flat
          bordered
          hide-pagination
        >
          <template v-slot:body-cell="props">
            <q-td :props="props">
              <div v-html="props.value"></div>
            </q-td>
          </template>          
        </q-table>
      </q-card-section>
      {{ actions }}
      
    </q-card>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    row: { default: {} },
    actions: { default: [] },
  },
  components: {},
  computed: {
    mainImage(){
      return this.row?.extraData?.mediaFiles?.mainimage?.url || false
    },
    extraDetails() {
      // Excluir la propiedad media_files y generar una lista de los otros detalles
      return this.row.extraData;
      
    },
    suppliers(){
      const columns = [
        { name: "id", align: "left", label: this.$tr('isite.cms.form.id'), field: "supplier", 
          format: val => `<a href="${val.url}" target="_blank">${val.id}</a>`
        },
        
        { name: "supplier", align: "left", label: this.$tr('iorder.cms.form.supplier'), field: "supplier", 
          format: val => `${val.firstName} ${val.lastName}`
        },
        { name: "status", align: "left", label: this.$tr('isite.cms.form.status'), field: "status",
          format: val => `${val.title}`
         },
        { name: "quantity", align: "center", label: this.$tr('iorder.cms.form.avaliableQuantity'), field: "quantity" },
        { name: "price", align: "center", label: this.$tr('iorder.cms.form.price'), field: "price",
          format: val => `$${val}`
        },
        { name: "total", align: "center", label: this.$tr('iorder.cms.form.total'), field: "total", 
          format: val => `$${val}`
         },        
        { name: "comment", align: "left", label: this.$tr('iorder.cms.form.observations'), field: "comment" },
        { name: "createdAt", align: "left", label: this.$tr('isite.cms.form.createdAt'), field: "createdAt", 
          format: val => this.$trd(val)
        },        
      ]
      const rows = this.row.suppliers || []
      return {columns, rows}
    }
  },
  methods: {}
})
</script>
<style lang="scss">
</style>