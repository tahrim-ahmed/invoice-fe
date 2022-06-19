<template>
	<q-layout>
		<q-page-container>
			<q-page class="row justify-center">
				<div class="col-12 q-px-md q-pt-md">
					<q-table :columns="columns" :data="rows" :loading="isLoading" :pagination.sync="pagination"
					         :style="'max-height: 88.5vh'" binary-state-sort card-class="full-width bg-card-theme"
					         row-key="id" wrap-cells @request="onRequest">
						<template v-slot:no-data="{ icon, message, filter }">
							<div class="text-overline full-width row justify-center q-py-xl">
								<q-icon :name="filter ? 'filter_b_and_w' : icon" class="col-1" color="warning" size="2em"/>
								<span>No data to show!</span>
							</div>
						</template>

						<template v-slot:top>
							<div class="q-table__control q-py-xs">
								<q-btn color="primary" icon="add" label="Client" size="sm" @click="addDialog = true"/>
							</div>
							<q-space/>
							<q-input v-model="filter" autogrow color="black" debounce="1000" dense label="Search">
								<template v-slot:append>
									<q-icon name="search"/>
								</template>
							</q-input>
						</template>

						<template v-slot:header-cell="props">
							<q-th :props="props" class="bg-grey-3">
								{{ props.col.label }}
							</q-th>
						</template>

						<template v-slot:body="props">
							<q-tr :props="props">

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.code }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.name }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.cell }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.email }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.billing }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.shipping }}
								</q-td>

								<q-td class="q-px-sm text-center">
									<q-icon class="cursor-pointer" color="dark" name="view_module" size="sm">
										<q-menu anchor="bottom left" fit self="top left" transition-hide="rotate" transition-show="rotate">
											<q-list style="min-width: 100px">
												<q-item clickable dense v-close-popup @click="openUpdateDialog(props.row)">
													<q-item-section side>
														<q-icon color="secondary" name="edit" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<q-item-label style="font-size: 15px">Edit</q-item-label>
													</q-item-section>
												</q-item>
												<q-separator/>
												<q-item clickable dense>
													<q-item-section side>
														<q-icon color="negative" name="delete_forever" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<div>Delete</div>
														<q-popup-proxy :breakpoint="700">
															<q-banner dense>
																<template v-slot:avatar>
																	<q-icon color="negative" name="delete_forever"/>
																</template>
																Would you really like to delete client
																<span class="text-bold text-negative">
																{{props.row.name}}
																</span> for forever?
																<template v-slot:action>
																	<q-btn color="negative" glossy @click="remove(props.row.id)" v-close-popup> Yes</q-btn>
																	<q-btn v-close-popup color="secondary" glossy> No</q-btn>
																</template>
															</q-banner>
														</q-popup-proxy>
													</q-item-section>
												</q-item>
											</q-list>
										</q-menu>
									</q-icon>
								</q-td>
							</q-tr>
						</template>
					</q-table>

					<!--	Add Client  -->
					<q-dialog v-model="addDialog" persistent>
						<q-card>
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeAddDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="info" label="Add Client Info"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="info">
									<q-form greedy @submit.prevent="saveClient">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.code" label="Client Code" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.name" label="Client Name" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.cell" label="Client Contact" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.email" label="Email" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.billing" label="Billing Address" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="client.shipping" label="Shipping Address" outlined dense/>
												</div>
											</div>
											<div class="row justify-end q-pt-md">
												<q-btn color="primary" label="Save" type="submit"/>
											</div>
										</q-card-section>
									</q-form>
								</q-tab-panel>
							</q-tab-panels>
						</q-card>
					</q-dialog>

					<!--	Edit Client  -->
					<q-dialog v-model="updateDialog" persistent>
						<q-card>
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeUpdateDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="info" label="Update Client Info"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="info">
									<q-form greedy @submit.prevent="saveUpdate">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateClient.code" label="Client Code" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateClient.name" label="Client Name" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateClient.cell" label="Client Contact" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateClient.email" label="Email" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateClient.billing" label="Billing Address" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model="updateClient.shipping" label="Shipping Address" outlined dense/>
												</div>
											</div>
											<div class="row justify-end q-pt-md">
												<q-btn color="primary" label="Update" type="submit"/>
											</div>
										</q-card-section>
									</q-form>
								</q-tab-panel>
							</q-tab-panels>
						</q-card>
					</q-dialog>
				</div>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import {Loading, QSpinnerClock, QSpinnerDots, QSpinnerTail} from "quasar";
import {ClientInterface} from "src/customs/interfaces/client.interface";
import {AxiosResponseInterface} from "src/customs/interfaces/axios-response.interface";
import {ResponseStatusEnum} from "src/customs/enum/response-status.enum";

@Component({})
export default class List extends Vue {
	tab = 'info'

	/***************** table ****************/
	rows: any = [];
	pagination: any = {
		sortBy: 'code',
		descending: false,
		page: 1,
		rowsPerPage: 15,
		rowsNumber: 0
	}
	isLoading: boolean = false;
	filter: string = ''
	columns: any = [
		{
			label: 'Code',
			name: 'code',
			field: 'code',
			align: 'left',
			sortable: true
		},{
			label: 'Name',
			name: 'name',
			field: 'name',
			align: 'left',
			sortable: true
		},{
			label: 'Contact No',
			name: 'cell',
			field: 'cell',
			align: 'left',
			sortable: true
		},{
			label: 'Email',
			name: 'email',
			field: 'email',
			align: 'left',
			sortable: true
		},{
			label: 'Billing Address',
			name: 'billing',
			field: 'billing',
			align: 'left',
		},{
			label: 'Shipping Address',
			name: 'shipping',
			field: 'shipping',
			align: 'left',
		},{
			label: 'Action',
			name: 'action',
			field: 'action',
			align: 'center',
			style: {width: '30px'}
		}
	]
	/*************** add ***************/
	addDialog: boolean = false;
	client: ClientInterface = {
		code: '',
		name: '',
		cell: '',
		billing: '',
		shipping: '',
		email: ''
	}
	/************* update ***************/
	updateDialog: boolean = false;
	updateClient: ClientInterface = {
		id: '',
		code: '',
		name: '',
		email: '',
		billing: '',
		shipping: '',
		cell: '',
	}

	openUpdateDialog(client: any) {
		this.updateClient.id = client.id;
		this.updateClient.code = client.code;
		this.updateClient.name = client.name;
		this.updateClient.cell = client.cell;
		this.updateClient.email = client.email;
		this.updateClient.billing = client.billing;
		this.updateClient.shipping = client.shipping;
		this.updateDialog = true;
	}

	created() {
		this.onRequest({
			pagination: this.pagination
		})
	}

	@Watch('filter', {immediate: true})
	onFilter() {
		this.onRequest({
			pagination: this.pagination
		})
	}


	onRequest({pagination}: any = {}) {
		if (pagination) {
			this.pagination = pagination
		}

		let url = 'client/pagination?page=' + this.pagination.page +
				'&limit=' + this.pagination.rowsPerPage

		this.$axios.get(url).then(async (response) => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface

				if (res.error) {
					this.$q.notify({
						message: res.message,
						type: 'negative'
					})
				} else {
					if (res.status === ResponseStatusEnum.SUCCESS) {
						this.rows = res?.page?.data || []
						this.pagination.rowsNumber = res.page.count
					}
				}
			}
		}).finally(() => {
			this.isLoading = false;
		})
	}

	saveClient() {
		//@ts-ignore
		Loading.show({spinner: QSpinnerClock, spinnerSize: '5rem', backgroundColor: 'grey'})
		this.$axios.post('client', this.client).then(response => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface
				this.$q.notify({
					message: res.message,
					type: res.status === ResponseStatusEnum.CREATED ? 'positive' : 'negative'
				})
				this.onFilter()
			}
		}).finally(() => {
			this.closeAddDialog();
			Loading.hide()
		})
	}

	closeAddDialog() {
		this.addDialog = false;
		this.client.code = ''
		this.client.name = ''
		this.client.cell = ''
		this.client.billing = ''
		this.client.shipping = ''
		this.client.email = ''
	}

	closeUpdateDialog() {
		this.updateDialog = false
		this.updateClient.id = ''
		this.updateClient.code = ''
		this.updateClient.name = ''
		this.updateClient.cell = ''
		this.updateClient.email = ''
		this.updateClient.billing = ''
		this.updateClient.shipping = ''
	}

	saveUpdate() {
		//@ts-ignore
		Loading.show({spinner: QSpinnerDots, spinnerSize: '5rem', backgroundColor: 'grey'})
		const url = `/client/${this.updateClient.id}`
		delete this.updateClient.id;
		this.$axios.put(url, this.updateClient).then(response => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface
				this.$q.notify({
					message: res.message,
					type: res.status === ResponseStatusEnum.SUCCESS ? 'positive' : 'negative'
				})
				this.onFilter()
			}
		}).finally(() => {
			this.closeUpdateDialog();
			Loading.hide()
		})
	}

	remove(id: string) {
		//@ts-ignore
		Loading.show({spinner: QSpinnerTail, spinnerSize: '5rem', backgroundColor: 'grey'})
		const url = `/client/${id}`
		this.$axios.delete(url).then(response => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface
				if (res.payload.data.isDeleted) {
					this.$q.notify({
						message: res.message,
						type: res.status === ResponseStatusEnum.SUCCESS ? 'positive' : 'negative'
					})
					this.onFilter();
				}
			}
		}).finally(() => {
			Loading.hide()
		})
	}
}
</script>


<style scoped>

</style>
