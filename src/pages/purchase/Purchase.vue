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
								<q-btn color="primary" icon="add" label="Purchase" size="sm" @click="addDialog = true"/>
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
									<q-icon name="calendar_month" color="secondary"/>
									{{ $helper.convertDate(props.row.purchaseDate) }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ $helper.numberWithCommas(props.row.totalPrice) }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									<q-chip :color="props.row.type === 'Cash' ? 'positive' : 'negative'"
									        text-color="black" class="text-bold"
									        :icon="props.row.type === 'Cash' ? 'paid' : 'credit_card'">
										{{ props.row.type }}
									</q-chip>
								</q-td>

								<q-td class="q-px-sm text-center">
									<q-icon class="cursor-pointer" color="dark" name="view_module" size="sm">
										<q-menu anchor="bottom left" fit self="top left" transition-hide="rotate" transition-show="rotate">
											<q-list style="min-width: 100px">
												<q-item clickable dense v-close-popup @click="openDetailsDialog(props.row)">
													<q-item-section side>
														<q-icon color="secondary" name="table_view" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<q-item-label style="font-size: 15px">Details</q-item-label>
													</q-item-section>
												</q-item>
												<q-separator/>
												<q-item clickable dense v-close-popup @click="openUpdateDialog(props.row)">
													<q-item-section side>
														<q-icon color="secondary" name="edit" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<q-item-label style="font-size: 15px">Update</q-item-label>
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
																Would you really like to delete product
																<span class="text-bold text-negative">
																{{ props.row.name }}
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

					<!--	Add Invoice  -->
					<q-dialog class="row" v-model="addDialog" persistent>
						<q-card :class="purchase.totalPrice > 0? 'col q-mr-md' : ''">
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeAddDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="info" label="New Purchase"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="info">
									<q-form greedy @submit.prevent="savePurchase">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-12">
													<date-picker-component v-model="purchase.purchaseDate" :dense="false"
													                       :rules="[$helper.rules.required]"
													                       class="col col-6" dense hide-bottom-space
													                       label="Purchase Date"/>
												</div>
												<div class="col-12 col-md-12">
												<q-select v-model="addMore.product" :options="productOptions" class="col col-4" clearable
													          input-debounce="1000" label="Select Product" map-options option-label="name"
													          use-input @filter="filterProductFn" outlined dense hide-bottom-space>
														<template v-slot:no-option>
															<q-item>
																<q-item-section class="text-grey">
																	No results
																</q-item-section>
															</q-item>
														</template>

													</q-select>
												</div>
												<div class="col-12 col-md-4 q-pt-md">
													<q-input v-model="addMore.unitPrice" label="Unit Price" outlined dense hide-bottom-space/>
												</div>
												<div class="col-12 col-md-4 q-pt-md">
													<q-input v-model.number="addMore.quantity" type="number" label="Quantity" outlined dense hide-bottom-space/>
												</div>
												<div class="col-md-4 q-pt-md">
													<q-btn class="full-width" label="Add Que" color="primary" @click="addToQueue" no-caps/>
												</div>
												<div class="col-12 col-md-12 q-pt-md">
													<q-select v-model="purchase.type" :options="purchaseOptions" class="col col-4"
													          input-debounce="1000" label="Select Payment Type" outlined dense/>
												</div>
											</div>
											<div class="row justify-end q-pt-md">
												<q-btn color="primary" label="Submit" type="submit"/>
											</div>
										</q-card-section>
									</q-form>
								</q-tab-panel>
							</q-tab-panels>
						</q-card>
						<q-card v-if="purchase.totalPrice > 0" class="col">
							<div class="row q-ma-md">
								<div class="col-12 col-md-12 text-bold">
									Purchase Date: {{ $helper.convertDate(purchase.purchaseDate) }}
								</div>
							</div>
							<div class="q-ma-md">
								<q-markup-table v-if="preservedProducts.length" bordered dense flat separator="cell" wrap-cells>
									<thead class="bg-primary text-white text-center">
									<tr>
										<th class="text-center text-uppercase" colspan="9">Product Information</th>
									</tr>
									<tr>
										<th>Product Name</th>
										<th>Pack Size</th>
										<th>Quantity</th>
										<th>Unit Price</th>
										<th>Total</th>
										<th>#</th>
									</tr>
									</thead>
									<tbody class="text-center">
									<tr v-for="(product, index) of preservedProducts" :key="product.product.id">
										<td>{{ product.product.name }}</td>
										<td>{{ product.product.packSize }}</td>
										<td>
											{{ product.quantity }}
											<q-popup-edit v-model="product.quantity" persistent>
												<template v-slot="scope">
													<q-input v-model.number="scope.value" autofocus dense type="number"
													         @keyup.enter="updateQuantity(index, scope.value)"/>
												</template>
											</q-popup-edit>
										</td>
										<td>
											৳ {{ product.unitPrice }}
											<q-popup-edit v-model="product.unitPrice" persistent>
												<template v-slot="scope">
													<q-input v-model.number="scope.value" autofocus dense type="number"
													         @keyup.enter="updateUnitPrice(index, scope.value)"/>
												</template>
											</q-popup-edit>
										</td>
										<td>৳ {{
												$helper.numberWithCommas((Number(product.quantity) * Number(product.unitPrice)).toFixed(2))
											}}
										</td>
										<td class="cursor-pointer">
											<q-icon name="delete" @click="removeQueue(index)"/>
										</td>
									</tr>
									<tr>
										<td class="text-right text-bold" colspan="4">Total Price</td>
										<td class="text-right text-bold">৳ {{
												$helper.numberWithCommas(purchase.totalPrice)
											}}
										</td>
									</tr>
									</tbody>
								</q-markup-table>
							</div>
						</q-card>
					</q-dialog>

					<!--	Invoice Details  -->
					<q-dialog v-model="detailsDialogue" persistent>
						<q-card style="width: 700px; max-width: 80vw; max-height: 100vw;">
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeDetailsDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="detailsTab" dense active-color="primary">
								<q-tab name="product" label="Purchase Details"/>
							</q-tabs>
							<q-tab-panels v-model="detailsTab" class="bg-grey-1" animated>
								<q-tab-panel name="product">
									<div class="row">
										<div class="col-6">
											Purchase Date: {{ $helper.convertDate(purchaseDetails.purchaseDate) }} <br>
										</div>
									</div>
									<q-markup-table dense class="q-mt-md">
										<thead class="bg-grey-12">
										<tr>
											<th class="text-left">Product Name</th>
											<th class="text-left">Pack Size</th>
											<th class="text-left">Quantity</th>
											<th class="text-left">Unit Price</th>
											<th class="text-left">Total</th>
										</tr>
										</thead>
										<tbody>
										<tr v-for="products of purchaseDetails.purchaseDetails">
											<td class="text-left">{{ products.product.name }}</td>
											<td class="text-left">{{ products.product.packSize }}</td>
											<td class="text-left">{{ products.quantity }}</td>
											<td class="text-left">{{ products.unitPrice }}</td>
											<td>৳
												{{
													$helper.numberWithCommas((Number(products.quantity) * Number(products.unitPrice)).toFixed(2))
												}}
											</td>
										</tr>
										<tr>
											<td class="text-right text-bold" colspan="4">Total TP</td>
											<td class="text-bold">৳
												{{
													$helper.numberWithCommas(purchaseDetails.totalPrice.toFixed(2))
												}}
											</td>
										</tr>
										</tbody>
									</q-markup-table>
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
import {Loading, QSpinnerClock, QSpinnerTail} from "quasar";
import {AxiosResponseInterface} from "src/customs/interfaces/axios-response.interface";
import {ResponseStatusEnum} from "src/customs/enum/response-status.enum";
import {ProductInterface} from "src/customs/interfaces/product.interface";
import DatePickerComponent from "src/components/date-picker/Date-picker.component.vue";
import {PurchaseInterface} from "src/customs/interfaces/purchase.interface";

interface AddMoreInterface {
	product: ProductInterface,
	unitPrice: number,
	quantity: number,
}

@Component({components: {DatePickerComponent}})
export default class Purchase extends Vue {
	tab = 'info'
	detailsTab = 'product'

	purchaseOptions: any[] = ['Cash', 'Credit'];

	detailsDialogue: boolean = false

	/***************** table ****************/
	rows: any = [];
	pagination: any = {
		sortBy: 'createdAt',
		descending: false,
		page: 1,
		rowsPerPage: 15,
		rowsNumber: 0
	}
	isLoading: boolean = false;
	filter: string = ''
	columns: any = [
		{
			label: 'Purchase Date',
			name: 'purchaseDate',
			field: 'purchaseDate',
			align: 'left',
			sortable: true,
		},{
			label: 'Total Amount',
			name: 'totalPrice',
			field: 'totalPrice',
			align: 'left',
			sortable: true
		},{
			label: 'Payment Type',
			name: 'type',
			field: 'type',
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
	purchase: PurchaseInterface = {
		purchaseDate: new Date().toISOString(),
		totalPrice: 0,
		type: '',
		createPurchaseDetailsDto: []
	}

	purchaseDetails: any = {
		createdAt: '',
		createdBy: '',
		deletedAt: '',
		id: '',
		purchaseDetails: [
			{
				product: {
					name: '',
					packSize: '',
				},
				quantity: 0,
				unitPrice: 0,
			}
		],
		purchaseDate: '',
		totalPrice: 0,
	}

	productOptions: any[] = [];

	preservedProducts: Array<AddMoreInterface> = [];

	addMore: AddMoreInterface = {
		product: null,
		quantity: null,
		unitPrice: null,
	}

	openDetailsDialog(purchase: any) {
		Object.keys(this.purchaseDetails).forEach((key: any) => {
			this.purchaseDetails[key] = purchase[key] || '';
		})
		this.detailsDialogue = true;
	}

	closeDetailsDialog() {
		this.detailsDialogue = false;
		this.detailsTab = 'product';
	}

	created() {
		this.onRequest({
			pagination: this.pagination
		})
	}

	@Watch('filter', { immediate: true })
	onFilter() {
		this.onRequest({
			pagination: this.pagination
		})
	}
	onRequest({ pagination }: any = {}) {
		if (!this.isLoading) {
			if (pagination) {
				this.pagination = pagination
			}
			this.isLoading = true
			this.rows = []
			let url =
					'purchase/pagination?page=' + this.pagination.page +
					'&limit=' + this.pagination.rowsPerPage +
					'&sort=' + this.pagination.sortBy +
					'&order=' + (this.pagination.descending ? 'DESC' : 'ASC')
			if (this.filter) url += '&search=' + this.filter
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
	}

	addToQueue() {
		this.preservedProducts.push(this.addMore)
		this.calculateTotal();
		this.resetAddMore();
	}

	calculateTotal() {
		if (this.addDialog) {
			this.purchase.totalPrice = this.preservedProducts.reduce((acc, cur) => acc + ((cur.quantity * cur.unitPrice)), 0)
		}
	}

	resetAddMore() {
		this.addMore = {
			product: {
				id: '', name: '', packSize: ''
			},
			unitPrice: null,
			quantity: null,
		}
	}

	updateQuantity(index: number, qty: number) {
		this.preservedProducts[index].quantity = qty;
		this.calculateTotal();
	}

	updateUnitPrice(index: number, price: number) {
		this.preservedProducts[index].unitPrice = price;
		this.calculateTotal();
	}

	removeQueue(index: number) {
		this.preservedProducts.splice(index, 1)
		this.calculateTotal();
	}

	savePurchase() {
		this.purchase.createPurchaseDetailsDto = this.preservedProducts.map(m => {
			return {
				productID: m.product.id,
				quantity: Number(m.quantity),
				unitPrice: Number(m.unitPrice),
			}
		})

		//@ts-ignore
		Loading.show({spinner: QSpinnerClock, spinnerSize: '5rem', backgroundColor: 'grey'})
		this.$axios.post('purchase', this.purchase).then(response => {
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
		this.purchase.totalPrice = 0
		this.purchase.createPurchaseDetailsDto = []
		this.purchase.type = ''
		this.preservedProducts = []
	}

	remove(id: string) {
		//@ts-ignore
		Loading.show({spinner: QSpinnerTail, spinnerSize: '5rem', backgroundColor: 'grey'})
		const url = `/purchase/${id}`
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

	/*************** filter ***************/
	filterProductFn(val: string, update: Function) {
		let url = 'product/search?page=1&limit=5';
		if (val) url += '&search=' + val
		this.$axios.get(url).then(async (response) => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface
				if (res.status === ResponseStatusEnum.SUCCESS) {
					update(() => {
						const products = res?.page?.data || [];
						this.productOptions = products.filter((f: any) => !this.preservedProducts.map(r => r.product.id).includes(f.id))
					})
				}
			}
		})
	}
}
</script>


<style scoped>

</style>
