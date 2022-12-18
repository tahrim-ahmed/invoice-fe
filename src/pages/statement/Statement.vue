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
								<q-btn color="primary" icon="add" label="Deposited" size="sm" @click="addDialog = true">
									<q-tooltip>Cash / Cheque Deposited to BAYER</q-tooltip>
								</q-btn>
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
									{{ $helper.convertDate(props.row.createdAt) }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.purpose }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ $helper.numberWithCommas(props.row.amount) }}
								</q-td>

								<q-td class="q-px-sm text-center">
									<q-icon class="cursor-pointer" color="dark" name="view_module" size="sm">
										<q-menu anchor="bottom left" fit self="top left" transition-hide="rotate" transition-show="rotate"
										        v-if="props.row.purpose === 'Paid to BAYER'">
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
																Would you really like to delete this statement for forever?
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
										<q-menu anchor="bottom left" fit self="top left" transition-hide="rotate" transition-show="rotate"
										        v-else>
											<q-list style="min-width: 100px">
												<q-item clickable dense>
													<q-item-section side>
														<q-icon color="negative" name="block" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<q-item-label style="font-size: 15px">No Action</q-item-label>
													</q-item-section>
												</q-item>
											</q-list>
										</q-menu>
									</q-icon>
								</q-td>
							</q-tr>
						</template>
					</q-table>

					<!--	Add Statement  -->
					<q-dialog v-model="addDialog" persistent>
						<q-card>
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeAddDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="info" label="Add Statement Info"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="info">
									<q-form greedy @submit.prevent="saveStatement">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model.number="statement.amount" type="number" label="Deposited Amount" outlined dense/>
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

					<!--	Edit Statement  -->
					<q-dialog v-model="updateDialog" persistent>
						<q-card>
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeUpdateDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="info" label="Update Statement Info"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="info">
									<q-form greedy @submit.prevent="saveUpdate">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-12 q-pt-md">
													<q-input v-model.number="updateStatement.amount" type="number" label="Deposited Amount" outlined
													         dense/>
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
import {AxiosResponseInterface} from "src/customs/interfaces/axios-response.interface";
import {ResponseStatusEnum} from "src/customs/enum/response-status.enum";
import {StatementInterface} from "src/customs/interfaces/statement.interface";

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
			label: 'Date',
			name: 'date',
			field: 'createdAt',
			align: 'left',
			sortable: true
		},{
			label: 'Statements',
			name: 'purpose',
			field: 'purpose',
			align: 'left',
			sortable: true
		},{
			label: 'Amount',
			name: 'amount',
			field: 'amount',
			align: 'left',
			sortable: true
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
	statement: StatementInterface = {
		purpose: 'Paid to BAYER',
		amount: null,
	}
	/************* update ***************/
	updateDialog: boolean = false;
	updateStatement: StatementInterface = {
		id: '',
		purpose: '',
		amount: null,
	}

	openUpdateDialog(statement: any) {
		this.updateStatement.id = statement.id;
		this.updateStatement.purpose = statement.purpose;
		this.updateStatement.amount = statement.amount;
		this.updateDialog = true;
	}

	created() {
		this.onRequest({
			pagination: this.pagination
		})
	}

	report() {

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

		let url = 'statement/pagination?page=' + this.pagination.page +
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

	saveStatement() {
		//@ts-ignore
		Loading.show({spinner: QSpinnerClock, spinnerSize: '5rem', backgroundColor: 'grey'})
		this.$axios.post('statement', this.statement).then(response => {
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
		this.statement.purpose = 'Paid to BAYER';
		this.statement.amount = null;
	}

	closeUpdateDialog() {
		this.updateDialog = false;
		this.updateStatement.purpose = '';
		this.updateStatement.amount = null;
	}

	saveUpdate() {
		//@ts-ignore
		Loading.show({spinner: QSpinnerDots, spinnerSize: '5rem', backgroundColor: 'grey'})
		const url = `/statement/${this.updateStatement.id}`
		delete this.updateStatement.id;
		this.$axios.put(url, this.updateStatement).then(response => {
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
		const url = `/statement/${id}`
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
