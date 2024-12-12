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
import { cache } from 'src/plugins/utils';

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
								name: 'mainImage', label: this.$tr('isite.cms.form.id'), field: 'item.extraData.mediaFiles.mainimage.url',
							},
							{
								name: 'id', label: this.$tr('isite.cms.form.id'), field: 'id', style: '',
							},
							{
								name: 'title', label: this.$tr('isite.cms.form.product'), field: 'item',
								align: 'left', 
								style: 'max-width: 250px;padding-top: 10px;font-family: Manrope;font-size: 15px;font-weight: 700;line-height: 20px;color: #0089FF',
								format: (val) => val.title || '-',
							},							

							/* price */
							{
								name: 'itemPrice', label: this.$tr('isite.cms.form.price'), field: 'item', align: 'center',
								icon: 'fa-solid fa-dollar',
								format: val => `<span class="q-ml-md">$${val.price}</span>`
							},
							
							/* providerPrice */
							{
								name: 'price', label: this.$tr('iorder.cms.form.supplierPrice'), field: 'price', align: 'center',
								icon: 'fa-solid fa-dollar',
								format: val => `<span class="q-ml-md">$${val}</span>`,
								dynamicField: row => {
									return {
										vIf: row.statusId == SUPPLY_STATUSES.SUPPLY_PENDING,
										type: 'input',
										props: {
											label: `${this.$tr('iorder.cms.form.supplierPrice')}`,
											type: 'number'
										},
									}
								}
							},

							
							/* requested quantity: */
							{
								name: 'requestedQuantity', label: this.$tr('iorder.cms.form.requestedQuantity'), field: 'item', align: 'center',
								icon: 'fa-regular fa-boxes-stacked',
								format: val => `<span class="q-ml-md">${val.quantity}</span>`
							},

							/* quantity: */
							{
								name: 'quantity', label: this.$tr('iorder.cms.form.avaliableQuantity'), field: 'quantity', align: 'center',
								icon: 'fa-regular fa-boxes-stacked',
								format: val => `<span class="q-ml-md">${val}</span>`,
								dynamicField: row => {
									return {
										vIf: row.statusId == SUPPLY_STATUSES.SUPPLY_PENDING,
										type: 'input',
										props: {
											label: `${this.$tr('iorder.cms.form.avaliableQuantity')}`,
											type: 'number'
										},
									}
								}
							},							
							/* comment */
							{ name: 'comment', label: this.$tr('iorder.cms.form.observations'), field: 'comment', align: 'center',
								icon: 'fa-regular fa-comment-dots',
								format: val =>  val ? `<span class="q-ml-md">${val}</span>` : `<span class="q-ml-lg">-</span>`,
								dynamicField: row => {
									return {
										vIf: row.statusId == SUPPLY_STATUSES.SUPPLY_PENDING,
										type: 'input',
										props: {
											label: `${this.$tr('iorder.cms.form.observations')}`, 
											autogrow: true
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
                label: this.$tr('iorder.cms.label.refuse'),
                style: "width: 100px",
                align: "center",
								color: 'grey-4',
								textColor: 'grey-8',
								vIf: (row) => (row.statusId == SUPPLY_STATUSES.SUPPLY_PENDING) && !row.isLoading,
                action: (row) => {
									this.$alert.warning({
										mode: 'modal',
										title: `ID: ${row.id} - ${row.item.title} `,
										message: this.$tr('iorder.cms.label.refuseMessage'),
										actions: [
											{ label: this.$tr('isite.cms.label.cancel'), color: 'grey' },
											{
												label: this.$tr('iorder.cms.label.refuseOrder'),
												color: 'red',
												handler: () => {
													row.statusId = SUPPLY_STATUSES.SUPPLY_REFUSED
													this.updateRow(row)
												}
											}
										]
									});
                }
              },
              {               
                name: 'accepted',
                label: this.$tr('iorder.cms.label.accept'),
                style: "width: 100px",
                color: 'green',
								vIf: (row) => (row.statusId == SUPPLY_STATUSES.SUPPLY_PENDING) && !row.isLoading,
                action: (row) => {
									this.$alert.info({
										mode: 'modal',
										title: `ID: ${row.id} - ${row.item.title} `,
										message: this.$tr('iorder.cms.label.acceptMessage'),
										actions: [
											{ label: this.$tr('isite.cms.label.cancel'), color: 'grey' },
											{
												label: this.$tr('iorder.cms.label.acceptOrder'),
												color: 'green',
												handler: () => {
													row.statusId = SUPPLY_STATUSES.SUPPLY_ACCEPTED
													this.updateRow(row)
												}
											}
										]
									});
                }
              },
            ],
					},
					requestParams: {
						include: 'item',
					},
					filters: {
						/*
						'item.orderId': {
              value: [],
              type: 'select',
              quickFilter: true,
              props: {
                label: '--orders',
                useInput: true,
                clearable: true,
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qorder.orders',
                select: {
                  label: 'id',
                  id: item => `${item.id}`
                }
              }
            },
						*/
						statusId: {
              type: 'select',
              name: 'statusId',
              quickFilter: true,
              props: {
                label: this.$tr('isite.cms.form.status'),
                useInput: true,
                clearable: true,
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
						description: this.$tr('iorder.cms.label.suppliesHelp')
					}

				}, 
				//runs before update the row
				beforeUpdate: ({ val, row}) => {
					return new Promise((resolve, reject) => {						
						let msgs = []
            /* price */
						if (row.price < 1 ) msgs.push(this.$tr('iorder.cms.form.beforeUpdate.invalidPrice'));
						/*quantity*/
						if (row.quantity < 1 ) msgs.push(this.$tr('iorder.cms.form.beforeUpdate.invalidQuantity'));
						if (row.quantity > row.item.quantity) msgs.push(this.$tr('iorder.cms.form.beforeUpdate.invalidAvaliableQuantity'));

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
		async updateRow(row){
			this.$refs.dynamicList.updateRow(row)
			await cache.remove({ allKey: 'apiRoutes.qorder.items' });
		}
	}
};
</script>
<style lang="scss">
.padding-none {
	padding: 0px !important;
}
</style>
