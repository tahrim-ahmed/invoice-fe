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
								<q-btn color="primary" icon="add" label="Invoice" size="sm" @click="addDialog = true"/>
							</div>
							<q-btn color="primary" label="Select Order Date Range" class="q-ml-md q-my-xs col-md-3 col-3" size="sm" no-caps>
								<q-menu v-model="show" anchor="bottom left" self="top left">
									<q-date v-model="dates" @input="show = false" range minimal style="background: #d1ffff">
										<div class="row justify-end q-pt-none q-mt-none">
											<q-btn label="Clear Selection" color="primary" size="sm" @click="resetSelection" no-caps/>
										</div>
									</q-date>
								</q-menu>
							</q-btn>
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
									{{ $helper.convertDate(props.row.orderDate) }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ $helper.convertDate(props.row.shippingDate) }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer">
									{{ props.row.client.code+' - '+props.row.client.name }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer text-bold">
									{{ $helper.numberWithCommas(Number(Number(props.row.totalTP) + Number(props.row.others) + Number(props.row.totalCommission))) }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer text-bold">
									{{ $helper.numberWithCommas(props.row.totalMRP) }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer text-bold">
									{{ $helper.numberWithCommas((Number(props.row.totalProfit).toFixed(2))) }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer text-bold">
									{{ props.row.paymentType }}
								</q-td>

								<q-td class="q-px-sm cursor-pointer text-bold">
									<q-chip dense :color="props.row.payment === 'Paid' ? 'positive' : 'negative'"
									        text-color="black" class="text-bold"
									        :icon="props.row.payment === 'Paid' ? 'price_check' : 'block'">
										{{ props.row.payment }}
									</q-chip>
								</q-td>

								<q-td class="q-px-sm text-center">
									<q-icon class="cursor-pointer" color="dark" name="view_module" size="sm">
										<q-menu anchor="bottom left" fit self="top left" transition-hide="rotate" transition-show="rotate">
											<q-list style="min-width: 100px">
												<!--Details Dialog-->
												<q-item clickable dense v-close-popup @click="openDetailsDialog(props.row)">
													<q-item-section side>
														<q-icon color="secondary" name="table_view" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<q-item-label style="font-size: 15px">Details</q-item-label>
													</q-item-section>
												</q-item>
												<q-separator/>
												<!--Payment Dialog-->
												<q-item v-if="props.row.payment !== 'Paid'" clickable dense>
													<q-item-section side>
														<q-icon color="info" name="local_atm" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<div>Paid</div>
														<q-menu anchor="bottom end" self="top left">
															<q-list style="min-width: 100px" class="bg-accent text-white">
																<q-item clickable>
																	<q-item-section>
																		<div>Full</div>
																		<q-popup-proxy :breakpoint="700">
																			<q-banner dense>
																				<template v-slot:avatar>
																					<q-icon color="info" name="local_atm"/>
																				</template>
																				Would you really like to mark this invoice as full paid?
																				<template v-slot:action>
																					<q-btn color="negative" glossy @click="paid(props.row.id)"
																					       v-close-popup label="Yes" no-caps/>
																					<q-btn v-close-popup color="secondary" glossy label="No" no-caps/>
																				</template>
																			</q-banner>
																		</q-popup-proxy>
																	</q-item-section>
																</q-item>
																<q-separator />
																<q-item clickable @click="partialPayment(props.row)">
																	<q-item-section>
																		<div>Partial</div>
																	</q-item-section>
																</q-item>
															</q-list>
														</q-menu>
													</q-item-section>
												</q-item>
												<q-separator/>
												<!--Download-->
												<q-item clickable dense v-close-popup @click="gotoPreview(props.row.id)">
													<q-item-section side>
														<q-icon color="positive" name="file_download" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<q-item-label style="font-size: 15px">Download</q-item-label>
													</q-item-section>
												</q-item>
												<q-separator/>
												<!--Print-->
												<q-item clickable dense v-close-popup @click="">
													<q-item-section side>
														<q-icon color="primary" name="print" style="font-size: 15px"/>
													</q-item-section>
													<q-item-section>
														<q-item-label style="font-size: 15px">Print</q-item-label>
													</q-item-section>
												</q-item>
												<q-separator/>
												<!--Delete-->
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
																Would you really like to delete invoice
																<span class="text-bold text-negative">
																{{props.row.invoiceID}}
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
						<q-card :class="invoice.clientID? 'col q-mr-md' : ''">
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closeAddDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-tabs class="q-pt-none" v-model="tab" dense active-color="primary">
								<q-tab name="info" label="New Invoice"/>
							</q-tabs>
							<q-tab-panels v-model="tab" class="bg-grey-1" animated>
								<q-tab-panel name="info">
									<q-form greedy @submit.prevent="saveInvoice">
										<q-card-section>
											<div class="row q-col-gutter-md">
												<div class="col-12 col-md-6">
													<date-picker-component v-model="invoice.orderDate" :dense="false"
													                       :rules="[$helper.rules.required]"
													                       class="col col-6" dense hide-bottom-space
													                       label="Order Date"/>
												</div>
												<div class="col-12 col-md-6">
													<date-picker-component v-model="invoice.shippingDate" :dense="false"
													                       :rules="[$helper.rules.required]"
													                       class="col col-6" dense hide-bottom-space
													                       label="Shipping Date"/>
												</div>
												<div class="col-12 col-md-6">
													<q-select v-model="invoice.clientID" :options="clientOptions" class="col col-4" clearable
													          input-debounce="1000" label="Select Client" map-options option-label="name"
													          option-value="id" emit-value hide-bottom-space
													          use-input @filter="filterClientFn" outlined dense>
														<template v-slot:no-option>
															<q-item>
																<q-item-section class="text-grey">
																	No results
																</q-item-section>
															</q-item>
														</template>

														<template v-slot:option="scope">
															<q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
																<q-item-section>
																	<q-item-label>
																		{{ scope.opt.code }} - {{ scope.opt.name }}
																	</q-item-label>
																</q-item-section>
															</q-item>
														</template>

													</q-select>
												</div>
												<div class="col-12 col-md-6">
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

														<template v-slot:option="scope">
															<q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
																<q-item-section>
																	<q-item-label>
																		{{ scope.opt.name }} - {{ scope.opt.packSize }}
																	</q-item-label>
																</q-item-section>
															</q-item>
														</template>

													</q-select>
												</div>
												<div class="col-12 col-md-4 q-pt-md">
													<q-input v-model="addMore.unitTP" label="Unit TP" outlined dense hide-bottom-space/>
												</div>
												<div class="col-12 col-md-4 q-pt-md">
													<q-input v-model.number="addMore.unitMRP" type="number" label="Unit Selling Price" outlined dense
													         hide-bottom-space/>
												</div>
												<div class="col-12 col-md-4 q-pt-md">
													<q-input v-model.number="addMore.quantity" type="number" label="Quantity" outlined dense hide-bottom-space/>
												</div>
												<div class="col-12 col-md-9 q-pt-md">
													<q-input v-model.number="addMore.discount" type="number" label="Discount %" outlined dense hide-bottom-space/>
												</div>
												<div class="col-md-3 q-pt-md">
													<q-btn class="full-width" label="Add Que" color="primary" @click="addToQueue" no-caps/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-select v-model="invoice.platform" :options="platformOptions" class="col col-4" clearable
													          input-debounce="1000" label="Select Platform" outlined dense @change="calculateTotal"/>
												</div>
												<div class="col-12 col-md-6 q-pt-md">
													<q-input v-model.number="invoice.others" type="number" label="Others Cost" outlined dense hide-bottom-space/>
												</div>
												<div class="col-12 col-md-grow q-pt-md">
													<q-select v-model="invoice.paymentType" :options="paymentOptions" clearable
													          input-debounce="1000" label="Payment Type" outlined dense/>
												</div>
												<div class="col-12 col-md-6 q-pt-md" v-if="invoice.paymentType === 'Credit'">
													<date-picker-component v-model="invoice.creditPeriod" :dense="false"
													                       class="col col-6" dense hide-bottom-space
													                       label="Credit Period"/>
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
						<q-card v-if="invoice.clientID" class="col">
							<div class="row q-ma-md">
								<div class="col-12 col-md-6 text-bold">
									Date: {{invDate}} <br>
									Client: {{currentClient.name}}
								</div>
								<div class="col-12 col-md-6 text-bold">
									Order Date: {{ $helper.convertDate(invoice.orderDate) }} <br>
									Shipping Date: {{ $helper.convertDate(invoice.shippingDate) }}
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
										<th>Unit TP</th>
										<th>Unit SP</th>
										<th>Dis %</th>
										<th>Dis Amount</th>
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
											৳ {{ product.unitTP }}
											<q-popup-edit v-model="product.unitTP" persistent>
												<template v-slot="scope">
													<q-input v-model.number="scope.value" autofocus dense type="number"
													         @keyup.enter="updateUnitTP(index, scope.value)"/>
												</template>
											</q-popup-edit>
										</td>
										<td>
											৳ {{ product.unitMRP }}
											<q-popup-edit v-model="product.unitMRP" persistent>
												<template v-slot="scope">
													<q-input v-model.number="scope.value" autofocus dense type="number"
													         @keyup.enter="updateUnitMRP(index, scope.value)"/>
												</template>
											</q-popup-edit>
										</td>
										<td>
											{{ (product.discount === '0') || (product.discount === 0) ? '-' : product.discount+'%' }}
											<q-popup-edit v-model="product.discount" persistent>
												<template v-slot="scope">
													<q-input v-model.number="scope.value" autofocus dense type="number"
													         @keyup.enter="updateDiscount(index, scope.value)"/>
												</template>
											</q-popup-edit>
										</td>
										<td>৳ {{
												$helper.numberWithCommas((((Number(product.quantity) * Number(product.unitMRP)) *
														Number(product.discount)) / 100).toFixed(2))
											}}
										</td>
										<td>৳ {{
												$helper.numberWithCommas(((Number(product.quantity) * Number(product.unitMRP)) -
														(((Number(product.quantity) * Number(product.unitMRP)) * Number(product.discount)) /
																100)).toFixed(2))
											}}
										</td>
										<td class="cursor-pointer">
											<q-icon name="delete" @click="removeQueue(index)"/>
										</td>
									</tr>
									<tr>
										<td class="text-right text-bold" colspan="7">Total TP</td>
										<td class="text-right text-bold">৳ {{
												$helper.numberWithCommas(invoice.totalTP)
											}}
										</td>
									</tr>
									<tr>
										<td class="text-right text-bold" colspan="7">Total Other Cost</td>
										<td class="text-right text-bold">৳ {{
												$helper.numberWithCommas(invoice.others)
											}}
										</td>
									</tr>
									<tr>
										<td class="text-right text-bold" colspan="7">Total MRP</td>
										<td class="text-right text-bold">৳ {{
												$helper.numberWithCommas(invoice.totalMRP)
											}}
										</td>
									</tr>
									<tr v-if="invoice.platform === 'Daraz'">
										<td class="text-right text-bold" colspan="7">Daraz Commission</td>
										<td class="text-right text-bold">৳ {{
												$helper.numberWithCommas((12 * Number(this.invoice.totalMRP)) / 100)
											}}
										</td>
									</tr>
									<tr>
										<td class="text-right text-bold" colspan="7">Total Profit</td>
										<td class="text-right text-bold">৳ {{
												invoice.platform === 'Daraz' ? $helper.numberWithCommas((Number(invoice.totalMRP) -
																Number(Number(invoice.totalTP) + Number(invoice.others) + Number((12 *
																		Number(invoice.totalMRP)) / 100))).toFixed(2)) :
														$helper.numberWithCommas((Number(invoice.totalMRP) -
																Number(Number(invoice.totalTP) + Number(invoice.others))).toFixed(2))
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
								<q-tab name="client" label="Client Details"/>
								<q-tab name="product" label="Invoice Details"/>
								<q-tab name="payment" label="Payment Details"/>
							</q-tabs>
							<q-tab-panels v-model="detailsTab" class="bg-grey-1" animated>
								<q-tab-panel name="client">
									<div class="row">
										<div class="col-6">
											Client Code: {{ invoiceDetails.client.code }} <br>
											Client Email: {{ invoiceDetails.client.email }} <br>
											Client Shipping: {{ invoiceDetails.client.shipping }} <br>
										</div>
										<div class="col-6">
											Client Name: {{ invoiceDetails.client.name }} <br>
											Client Cell: {{ invoiceDetails.client.cell }} <br>
											Client Billing: {{ invoiceDetails.client.billing }} <br>
										</div>
									</div>
								</q-tab-panel>
								<q-tab-panel name="product">
									<div class="row">
										<div :class="invoiceDetails.payment === 'Paid' ? 'col-6' : 'col-4'">
											Order Date: {{ $helper.convertDate(invoiceDetails.orderDate) }} <br>
										</div>
										<div :class="invoiceDetails.payment === 'Paid' ? 'col-6 text-right' : 'col-4 text-center'">
											Shipping Date: {{ $helper.convertDate(invoiceDetails.shippingDate) }} <br>
										</div>
										<div class="col-4 text-right" v-if="invoiceDetails.payment !== 'Paid'">
											Due Date: {{ $helper.convertDate(invoiceDetails.creditPeriod) }} <br>
										</div>
									</div>
									<q-markup-table dense class="q-mt-md">
										<thead class="bg-grey-12">
										<tr>
											<th class="text-left">Product Name</th>
											<th class="text-left">Pack Size</th>
											<th class="text-left">Quantity</th>
											<th class="text-left">Unit TP</th>
											<th class="text-left">Unit MRP</th>
											<th class="text-left">Dis %</th>
											<th class="text-left">Dis Amount</th>
											<th class="text-left">Total</th>
										</tr>
										</thead>
										<tbody>
										<tr v-for="products of invoiceDetails.invoiceDetails">
											<td class="text-left">{{ products.product.name }}</td>
											<td class="text-left">{{ products.product.packSize }}</td>
											<td class="text-left">{{ products.quantity }}</td>
											<td class="text-left">{{ products.unitTP }}</td>
											<td class="text-left">{{ products.unitMRP }}</td>
											<td class="text-left">{{ products.discount === 0 ? '-' : products.discount+' %' }}</td>
											<td>
												{{
													products.discount === 0 ? '-' : '৳ '+$helper.numberWithCommas((((Number(products.quantity) *
															Number(products.unitMRP)) * Number(products.discount)) / 100).toFixed(2))
												}}
											</td>
											<td>৳
												{{
													$helper.numberWithCommas(((Number(products.quantity) * Number(products.unitMRP)) -
															(((Number(products.quantity) * Number(products.unitMRP)) * Number(products.discount)) /
																	100)).toFixed(2))
												}}
											</td>
										</tr>
										<tr>
											<td class="text-right text-bold" colspan="7">Total MRP</td>
											<td class="text-bold">৳
												{{
													$helper.numberWithCommas(invoiceDetails.totalMRP.toFixed(2))
												}}
											</td>
										</tr>
										<tr>
											<td class="text-right text-bold" colspan="7">Total TP</td>
											<td class="text-bold">৳
												{{
													$helper.numberWithCommas(invoiceDetails.totalTP.toFixed(2))
												}}
											</td>
										</tr>
										<tr v-if="invoiceDetails.platform === 'Daraz'">
											<td class="text-right text-bold" colspan="7">Daraz Commission</td>
											<td class="text-bold">৳
												{{
													$helper.numberWithCommas(invoiceDetails.totalCommission.toFixed(2))
												}}
											</td>
										</tr>
										<tr>
											<td class="text-right text-bold" colspan="7">
												Others
												<q-tooltip>
													Including Packing, travelling
												</q-tooltip>
											</td>
											<td class="text-bold">৳
												{{
													invoiceDetails.others > 0 ? $helper.numberWithCommas(invoiceDetails.others) : 0
												}}
											</td>
										</tr>
										<tr>
											<td class="text-right text-bold" colspan="7">
												{{ Number(invoiceDetails.totalProfit) >= 0 ?
													'Profit' : 'Loss' }}
											</td>
											<td class="text-bold">৳
												{{
													$helper.numberWithCommas((Number(invoiceDetails.totalProfit).toFixed(2)))
												}}
											</td>
										</tr>
										</tbody>
									</q-markup-table>
								</q-tab-panel>
								<q-tab-panel name="payment">
									<div class="row">
										<div class="col-6">
											Invoice ID: {{ invoiceDetails.invoiceID }} <br>
										</div>
										<div class="col-6">
											Creation Date: {{ $helper.convertDate(invoiceDetails.createdAt) }} <br>
										</div>
										<div class="col-6">
											Payment Type: {{ invoiceDetails.paymentType }} <br>
										</div>
										<div class="col-6">
											Payment Status: {{ invoiceDetails.payment }} <br>
										</div>
										<div class="col-6">
											Paid Amount: {{ invoiceDetails.paidAmount }} <br>
										</div>
										<div class="col-6">
											Due Amount: {{ Number(invoiceDetails.totalMRP) - Number(invoiceDetails.paidAmount) }} <br>
										</div>
									</div>
								</q-tab-panel>
							</q-tab-panels>
						</q-card>
					</q-dialog>

					<!--	Payment Dialog	-->
					<q-dialog v-model="paymentDialogue" persistent>
						<q-card style="width: 400px; max-width: 80vw; max-height: 100vw;">
							<q-bar class="bg-primary text-white">
								<q-space />
								<q-btn dense flat icon="close" @click="closePaymentDialog">
									<q-tooltip>Close</q-tooltip>
								</q-btn>
							</q-bar>
							<q-form greedy @submit.prevent="savePartialPayment">
								<q-card-section class="q-pa-none q-ml-md q-mt-md text-bold">
									Pay Amount
								</q-card-section>
								<q-card-section>
									<div class="row q-col-gutter-md">
										<div class="col-12 col-md-12 q-pt-md">
											<q-input v-model.number="invoiceDetails.paidAmount" type="number" label="Already Paid" outlined dense
											         hide-bottom-space disable/>
										</div>
										<div class="col-12 col-md-12 q-pt-md">
											<q-input v-model.number="invoiceDetails.dueAmount" type="number" label="Due Amount" outlined dense
											         hide-bottom-space disable/>
										</div>
										<div class="col-12 col-md-12 q-pt-md">
											<q-input v-model.number="partialPay.amount" label="Pay Amount" outlined dense hide-bottom-space type="number"
											         :rules="[val => !!val || '* Required',
											         val => val <= Number(invoiceDetails.dueAmount) ||
											         'Amount should be Less than or Equal to the due']"/>
										</div>
									</div>
									<div class="row justify-end q-pt-md">
										<q-btn color="primary" label="Submit" type="submit"/>
									</div>
								</q-card-section>
							</q-form>
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
import {InvoiceInterface} from "src/customs/interfaces/invoice.interface";
import {ProductInterface} from "src/customs/interfaces/product.interface";
import DatePickerComponent from "src/components/date-picker/Date-picker.component.vue";
import moment from "moment";

interface AddMoreInterface {
	product: ProductInterface,
	unitTP: number,
	unitMRP: number,
	quantity: number,
	discount: number
}

@Component({components: {DatePickerComponent}})
export default class List extends Vue {
	tab = 'info'
	detailsTab = 'client'

	detailsDialogue: boolean = false
	paymentDialogue: boolean = false

	invDate: any = this.$helper.convertDate(new Date())

	show: boolean = false

	dates: any = {
		from: moment().startOf('year').toDate(),
		to: moment().toDate()
	}

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
			label: 'Order Date',
			name: 'orderDate',
			field: 'orderDate',
			align: 'left',
			sortable: true,
		},{
			label: 'Shipping Date',
			name: 'shippingDate',
			field: 'shippingDate',
			align: 'left',
			sortable: true
		},{
			label: 'Client',
			name: 'clientName',
			field: 'name',
			align: 'left',
			sortable: true
		},{
			label: 'Total Cost',
			name: 'totalCost',
			field: 'totalCost',
			align: 'left',
			sortable: true
		},{
			label: 'Total Sold',
			name: 'totalSold',
			field: 'totalSold',
			align: 'left',
			sortable: true
		},{
			label: 'Profit',
			name: 'totalProfit',
			field: 'totalProfit',
			align: 'left',
		},{
			label: 'Type',
			name: 'paymentType',
			field: 'paymentType',
			align: 'left',
		},{
			label: 'Payment',
			name: 'payment',
			field: 'payment',
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
	invoice: InvoiceInterface = {
		clientID: '',
		orderDate: new Date().toISOString(),
		shippingDate: new Date().toISOString(),
		totalTP: 0,
		totalMRP: 0,
		totalCommission: 0,
		others: 0,
		totalProfit: 0,
		platform: '',
		payment: '',
		paymentType: '',
		creditPeriod: null,
		createInvoiceDetailsDto: []
	}

	partialPay: {
		id: string
		amount: number
	} = {
		id:'',
		amount: null
	}

	invoiceDetails: any = {
		client: {
			code: '',
			name: '',
			contact: '',
			billing: '',
			shipping: '',
			email: ''
		},
		createdAt: '',
		createdBy: '',
		creditPeriod: '',
		deletedAt: '',
		dueAmount: 0,
		id: '',
		invoiceDetails: [
			{
				discount: 0,
				product: {
					name: '',
					packSize: '',
				},
				quantity: 0,
				unitMRP: 0,
				unitTP: 0,
			}
		],
		invoiceID: '',
		orderDate: '',
		others: 0,
		paidAmount: 0,
		payment: '',
		paymentType: '',
		platform: '',
		shippingDate: '',
		totalCommission: 0,
		totalMRP: 0,
		totalTP: 0,
		totalProfit: 0,
	}

	currentClient: any = {}

	productOptions: any[] = [];
	clientOptions: any[] = [];
	platformOptions: any[] = ['Daraz', 'Facebook', 'Offline'];
	paymentOptions: any[] = ['Cash', 'Credit'];

	preservedProducts: Array<AddMoreInterface> = [];

	addMore: AddMoreInterface = {
		product: null,
		quantity: null,
		unitTP: null,
		unitMRP: null,
		discount: 0
	}

	openDetailsDialog(invoice: any) {
		Object.keys(this.invoiceDetails).forEach((key: any) => {
			this.invoiceDetails[key] = invoice[key] || '';
		})
		this.invoiceDetails.dueAmount = Number(invoice.totalMRP) - Number(invoice.paidAmount);
		this.detailsDialogue = true;
	}

	closeDetailsDialog() {
		this.detailsDialogue = false;
		this.detailsTab = 'client';
	}

	closePaymentDialog() {
		this.paymentDialogue = false;
		this.partialPay.id = '';
		this.partialPay.amount = null;
	}

	@Watch('invoice.clientID')
	onAddInvoiceChange() {
		const client = this.clientOptions.find((f: any) => f.id === this.invoice.clientID)
		if (client) this.currentClient = client
	}

	created() {
		this.onRequest({
			pagination: this.pagination
		})
	}

	@Watch('filter', { immediate: true })
	@Watch('dates', { immediate: true })
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
					'invoice/pagination?page=' + this.pagination.page +
					'&limit=' + this.pagination.rowsPerPage +
					'&sort=' + this.pagination.sortBy +
					'&order=' + (this.pagination.descending ? 'DESC' : 'ASC')
			if (this.filter) url += '&search=' + this.filter
			url += '&startDate=' + this.dates.from + '&endDate=' + this.dates.to
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
			this.invoice.totalMRP = this.preservedProducts.reduce((acc, cur) => acc + ((cur.quantity * cur.unitMRP) - (((Number(cur.quantity) *
					Number(cur.unitMRP) *
					cur.discount)) / 100)), 0)

			this.invoice.totalTP = this.preservedProducts.reduce((acc, cur) => acc + ((cur.quantity * cur.unitTP)), 0)
		}
	}

	resetAddMore() {
		this.addMore = {
			product: null,
			unitTP: null,
			unitMRP: null,
			quantity: null,
			discount: null
		}
	}

	updateQuantity(index: number, qty: number) {
		this.preservedProducts[index].quantity = qty;
		this.calculateTotal();
	}

	updateUnitTP(index: number, price: number) {
		this.preservedProducts[index].unitTP = price;
		this.calculateTotal();
	}

	updateUnitMRP(index: number, price: number) {
		this.preservedProducts[index].unitMRP = price;
		this.calculateTotal();
	}

	updateDiscount(index: number, discount: number) {
		this.preservedProducts[index].discount = discount;
		this.calculateTotal();
	}

	removeQueue(index: number) {
		this.preservedProducts.splice(index, 1)
		this.calculateTotal();
	}

	saveInvoice() {
		this.invoice.createInvoiceDetailsDto = this.preservedProducts.map(m => {
			return {
				productID: m.product.id,
				quantity: Number(m.quantity),
				unitTP: Number(m.unitTP),
				unitMRP: Number(m.unitMRP),
				discount: Number(m.discount),
			}
		})

		this.invoice.paymentType === 'Cash' ? this.invoice.payment = 'Paid' : this.invoice.payment = 'Unpaid'

		if (this.invoice.platform === 'Daraz') {
			this.invoice.totalCommission = Number((12 * Number(this.invoice.totalMRP)) / 100)

			this.invoice.totalProfit = Number(this.invoice.totalMRP) -
					Number(Number(this.invoice.totalTP) + Number(this.invoice.others) + Number((12 *
							Number(this.invoice.totalMRP)) / 100))
		}
		else {
			this.invoice.totalCommission = 0

			this.invoice.totalProfit = Number(this.invoice.totalMRP) - Number(Number(this.invoice.totalTP) + Number(this.invoice.others))
		}

		//@ts-ignore
		Loading.show({spinner: QSpinnerClock, spinnerSize: '5rem', backgroundColor: 'grey'})
		this.$axios.post('invoice', this.invoice).then(response => {
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
		this.invoice.clientID = ''
		this.invoice.totalTP = 0
		this.invoice.totalMRP = 0
		this.invoice.others = 0
		this.invoice.platform = ''
		this.invoice.createInvoiceDetailsDto = []
		this.invoice.payment = ''
		this.invoice.paymentType = ''
		this.invoice.creditPeriod = null
		this.preservedProducts = []
		this.currentClient = {}
	}

	resetSelection() {
		this.dates.from = moment().startOf('year').toDate()
		this.dates.to = moment().toDate()
		this.onFilter()
	}

	partialPayment(payment: any) {
		Object.keys(this.invoiceDetails).forEach((key: any) => {
			this.invoiceDetails[key] = payment[key] || '';
		})
		this.invoiceDetails.dueAmount = Number(payment.totalMRP) - Number(payment.paidAmount);
		this.partialPay.id = payment.id;
		this.paymentDialogue = true
	}

	paid(id: string) {
		//@ts-ignore
		Loading.show({ spinner: QSpinnerClock, spinnerSize: '5rem', backgroundColor: 'grey' })
		const url = `/invoice/paid/${id}`
		this.$axios.patch(url).then(response => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface
				this.$q.notify({
					message: res.message,
					type: res.status === ResponseStatusEnum.SUCCESS ? 'positive' : 'negative'
				})
				this.onFilter()
			}
		}).finally(() => {
			Loading.hide()
		})
	}

	savePartialPayment() {
		//@ts-ignore
		Loading.show({spinner: QSpinnerClock, spinnerSize: '5rem', backgroundColor: 'grey'})
		this.$axios.patch('invoice/partial-pay', this.partialPay).then(response => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface
				this.$q.notify({
					message: res.message,
					type: res.status === ResponseStatusEnum.SUCCESS ? 'positive' : 'negative'
				})
				this.onFilter()
			}
		}).finally(() => {
			this.closePaymentDialog();
			Loading.hide()
		})
	}

	remove(id: string) {
		//@ts-ignore
		Loading.show({spinner: QSpinnerTail, spinnerSize: '5rem', backgroundColor: 'grey'})
		const url = `/invoice/${id}`
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

	gotoPreview(id: string) {
		window.open('preview?id='+id)
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

	filterClientFn(val: string, update: Function) {
		let url = 'client/search?page=1&limit=5';
		if (val) url += '&search=' + val
		this.$axios.get(url).then(async (response) => {
			if (!(response instanceof Error)) {
				const res = response.data as AxiosResponseInterface
				if (res.status === ResponseStatusEnum.SUCCESS) {
					update(() => {
						this.clientOptions = res?.page?.data || []
					})
				}
			}
		})
	}
}
</script>


<style scoped>

</style>
