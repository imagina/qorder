<template>
	<div>
		<!-- orders --->
		<div class="q-px-md">
			<dynamicList ref="dynamicList" :listConfig="listConfig" @new="() => $refs.crudComponent.create()">
			</dynamicList>
		</div>
	</div>
</template>
<script>
//Components
import dynamicList from 'modules/qsite/_components/master/dynamicList';
import {SUPPLY_STATUSES} from 'src/modules/qorder/_components/status/constants';

export default {
	props: {},
	components: {
		dynamicList
	},
	watch: {},
	mounted() {
		this.$nextTick(function () {
		});
	},
	data() {
		return {			
			loading: false,
			listConfig: {
				apiRoute: 'apiRoutes.qorder.supplies',
				//permission: 'iorder.orders.manage',
				pageActions: {
					extraActions: ['search']
				},
				showAs: 'grid',
				read: {
					title: this.$tr('iorder.cms.suppliesManagement'),
					tableProps: {
					},
					grid: {
						columns: [
							{
								name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: '',
							},
							{
								name: 'title', label: 'Producto', field: 'item',
								align: 'left', 
								style: 'max-width: 250px;padding-top: 10px;font-family: Manrope;font-size: 15px;font-weight: 700;line-height: 20px;color: #0089FF',
								format: (val) => val.title || '-',
							},							

							/* price */
							{
								name: 'itemPrice', label: 'Precio Waruwa', field: 'item', align: 'center',
								icon: 'fa-regular fa-dollar',
								format: val => `$${val.price}`
							},
							
							/* providerPrice */
							{
								name: 'price', label: 'precio Proveedor', field: 'price', align: 'center',
								icon: 'fa-regular fa-dollar',
								format: val => `$${val}`,
								dynamicField: row => {
									return {
										vIf: row.statusId == SUPPLY_STATUSES.SUPPLY_PENDING,
										type: 'input',
										props: {
											label: `${this.$tr('isite.cms.form.units')}*`,
											rules: [
												val => !!val || this.$tr('isite.cms.message.fieldRequired')
											],
										},
									}
								}
							},

							
							/* requested quantity: */
							{
								name: 'requestedQuantity', label: 'Unidades Solicitadas', field: 'item', align: 'center',
								icon: 'fa-regular fa-boxes-stacked',
								format: val => val.quantity
							},

							/* quantity: */
							{
								name: 'quantity', label: 'Unidades Disponibles', field: 'quantity', align: 'center',
								icon: 'fa-regular fa-boxes-stacked',
								dynamicField: row => {
									return {
										vIf: row.statusId == SUPPLY_STATUSES.SUPPLY_PENDING,
										type: 'input',
										props: {
											label: `${this.$tr('isite.cms.form.units')}*`,
											rules: [
												val => !!val || this.$tr('isite.cms.message.fieldRequired')
											],
										},
									}
								}
							},							
							/* comment */
							{ name: 'comment', label: this.$tr('isite.cms.form.observations'), field: 'comment', align: 'center',
								icon: 'fa-regular fa-comment-dots',
								format: val => val || '-',
								dynamicField: row => {
									return {
										vIf: row.statusId == SUPPLY_STATUSES.SUPPLY_PENDING,
										type: 'input',
										props: {
											label: `${this.$tr('isite.cms.form.observations')}`										
										}
									}
              	}
							 }, 
							 /*status */
							{
								name: 'status', label: this.$tr('isite.cms.form.status'), field: 'status',								
								align: 'left', style: 'max-width: 250px',
								format: val => `<span class="${val.icon}" style="color: ${val.color}"></span>&nbsp;&nbsp;${val.title}`
							},
						],
						actions: [
              {               
                name: 'refused',
                label: 'Rechazar',
                style: "width: 100px",
                align: "center",
								color: 'grey-4',
								textColor: 'grey',
								vIf: (row) => (row.statusId == SUPPLY_STATUSES.SUPPLY_PENDING) && !row.isLoading,
                action: (row) => {
									row.statusId = SUPPLY_STATUSES.SUPPLY_REFUSED
									this.updateRow(row)
                }
              },
              {               
                name: 'accepted',
                label: 'Aceptar',
                style: "width: 100px",
                color: 'green',
								vIf: (row) => (row.statusId == SUPPLY_STATUSES.SUPPLY_PENDING) && !row.isLoading,
                action: (row) => {
									row.statusId = SUPPLY_STATUSES.SUPPLY_ACCEPTED
									this.updateRow(row)
                }
              },
            ],
					},
					requestParams: {
						include: 'item',
					},
					filters: {
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
                    groupId: '3'
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
						title: this.$tr('iorder.cms.suppliesManagement'),
						description: this.$tr('iorder.cms.suppliesManagement')
					}

				}, 
				//runs before update the row
				beforeUpdate: ({ val, row}) => {
					return new Promise((resolve, reject) => {						
						let msgs = []
            /* price */
						if (row.price < 1 ) msgs.push(`'el precio del proveedor debe ser menor`)

						/*quantity*/
						if (row.quantity < 1 ) msgs.push(`ingrese una cantidad valida`)

						if (row.quantity > row.item.quantity) msgs.push(`la cantidad debe ser menor a la solicitada`)

						if(msgs.length) {
							this.$alert.error({message: msgs.join(', ')});
							return reject();
						}

						return resolve(row);
          });
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
		}, 
		async updateRow(row){
			this.$refs.dynamicList.updateRow(row)
			//await cache.remove({ allKey: 'apiRoutes.qorder.orders' });
		}
	}
};
</script>
<style lang="scss">
.padding-none {
	padding: 0px !important;
}
</style>
