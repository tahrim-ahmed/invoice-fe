<template>
	<q-layout>
		<q-page-container>
			<q-page class="row justify-center">
				<div class="row" ref="content">
					<div class="page">
						<div style="margin-top: 105px; margin-left: 36px; border: 1px solid #535355; width: 106px; padding-left: 4px; color: #ffff;
					background: #535355;">
							OFFICE COPY
						</div>
						<div style="font-size: 46px; margin-left: 32px;">
							INVOICE
						</div>
						<div style="margin-left: 36px; margin-right: 36px">
							<table>
								<tr style="height: 190px">
									<td style="border: 1px solid; width: 30%">
										<p style="background: rgb(188, 189, 192); margin-bottom: 3px; font-weight: bold; font-size: 12px; text-align: center">
											Billing Address
										</p>
										<p class="q-pl-xs" style="margin: 0">
											{{invoiceData.client.name}} <br>
											Proprietor: {{invoiceData.client.proprietor}} <br>
											ID: {{invoiceData.client.code}} <br>
											Cell: {{invoiceData.client.cell}}
										</p>
										<p style="background: rgb(188, 189, 192); margin-top: 20px; margin-bottom: 3px; font-weight: bold;
									font-size: 12px; text-align: center">
											Shipping Address
										</p>
										<p class="q-pl-xs" style="margin: 0">
											Address: {{invoiceData.client.shipping}} <br>
											Production: {{invoiceData.client.production}} <br>
											Email: {{invoiceData.client.email}}
										</p>
									</td>
									<td style="border: 1px solid; width: 45%">
										<div class="row">
											<div class="col-6 text-bold q-pl-xs">
												Invoice No: <br>
												Invoice Date: <br>
												Invoice Created By:
											</div>
											<div class="col-6 text-right q-pr-xs">
												{{invoiceData.invoiceID}}<br>
												{{$helper.convertDate(invoiceData.createdAt)}}<br>
												<span class="text-bold">
												{{$store.getters.currentUser.userName}}
											</span>
											</div>
										</div>
										<q-separator class="q-my-sm" style="background: black"/>
										<div class="row">
											<div class="col-6 text-bold q-pl-xs">
												Invoice Place: <br>
												<br>
												Product Disbursement From: <br>
												Product Transported By:
											</div>
											<div class="col-6 text-right q-pr-xs">
												Head Office <br>
												River Communication<br>
												-<br>
												Local
											</div>
										</div>
										<div class="row">
											<div class="col-4 text-bold q-pl-xs">
												Email:
											</div>
											<div class="col-8 text-right q-pr-xs">
												dis.rivercommunication@gmail.com
											</div>
										</div>
									</td>
									<td class="q-pr-xs text-right" style="border: 1px solid; width: 25%; font-size: 8px">

									<span class="text-bold">
										INVOICE BY<br>
									</span>
										<span class="text-bold">
										River Communication<br>
									</span>
										<span class="text-bold">
										Proprietor:
									</span>
										Ashiqur Rahman<br>
										<span class="text-bold">
										Cell:
									</span>
										+88(0)1717-150423<br>
										<span class="text-bold">
										Distributor Of<br>
									</span>
										Bayer CropScience Ltd.<br>
										<span class="text-bold">
										Dis. Code:
									</span>
										4665597<br>
										<span class="text-bold">
										House: 1191, Avenue: 12, Road: 10,<br>
										Mirpur DOHS, Dhaka, Bangladesh<br>
									</span>

										<q-separator class="q-my-sm" style="background: black"/>

										<span class="text-bold">
										Bank Details<br>
									</span>
										<span class="text-bold">
										River Communication<br>
									</span>
										<span class="text-bold">
										A/C No:
									</span>
										111411100000281<br>
										<span class="text-bold">
										Router No:
									</span>
										247262981<br>
										<span class="text-bold">
										Meghna Bank Ltd.<br>
									</span>
										<span class="text-bold">
										Mirpur Branch<br>
									</span>

									</td>
								</tr>
							</table>
						</div>
						<div style="margin-left: 36px; margin-right: 36px; margin-top: 10px">
							<table>
								<tr>
									<th style="border-left: 1px solid #000000; border-right: 1px solid #000000">Sl.</th>
									<th style="border-left: 1px solid #000000; border-right: 1px solid #000000">Product Name</th>
									<th style="border-left: 1px solid #000000; border-right: 1px solid #000000">Size</th>
									<th style="border-left: 1px solid #000000; border-right: 1px solid #000000">Rate</th>
									<th style="border-left: 1px solid #000000; border-right: 1px solid #000000">QTY</th>
									<th style="border-left: 1px solid #000000; border-right: 1px solid #000000">Gross Amount</th>
									<th style="border-left: 1px solid #000000; border-right: 1px solid #000000">Dis %</th>
									<th style="border-left: 1px solid #000000; border-right: 1px solid #000000">Dis. Amount</th>
									<th style="border-left: 1px solid #000000; border-right: 1px solid #000000">Amount</th>
								</tr>
								<tr v-for="(details, index) in invoiceData.invoiceDetails" :key="Math.random()">
									<td style="text-align: center; border-left: 1px solid; border-right: 1px solid">{{index+1}}</td>
									<td class="q-pl-xs">{{details.product.name}}</td>
									<td style="text-align: center; border-left: 1px solid; border-right: 1px solid">{{details.product.packSize}}</td>
									<td style="text-align: center; border-left: 1px solid; border-right: 1px solid">{{$helper.numberWithCommas(details.unitMRP)}} BDT</td>
									<td style="text-align: center; border-left: 1px solid; border-right: 1px solid">{{details.quantity}} PC</td>
									<td style="text-align: center; border-left: 1px solid; border-right: 1px solid">
										{{$helper.numberWithCommas(details.unitMRP *  details.quantity)}} BDT
									</td>
									<td style="text-align: center; border-left: 1px solid; border-right: 1px solid">
										{{ details.discount === 0? '-' : details.discount }}
									</td>
									<td style="text-align: center; border-left: 1px solid; border-right: 1px solid">
										{{
											details.discount === 0? '-' : $helper.numberWithCommas((details.unitMRP *  details.quantity * details.discount)
													/ 100) + ' BDT'
										}}
									</td>
									<td style="text-align: center; border-left: 1px solid; border-right: 1px solid">
										{{$helper.numberWithCommas((details.unitMRP *  details.quantity) - ((details.unitMRP *  details.quantity *
											details.discount) / 100))}} BDT
									</td>
								</tr>
								<tr style="color: transparent" v-for="length in tableLength">
									<td style="text-align: center; border-left: 1px solid #000000; border-right: 1px solid #000000"></td>
									<td>a</td>
									<td style="text-align: center; border-left: 1px solid #000000; border-right: 1px solid #000000">a</td>
									<td style="text-align: center; border-left: 1px solid #000000; border-right: 1px solid #000000">a</td>
									<td style="text-align: center; border-left: 1px solid #000000; border-right: 1px solid #000000">a</td>
									<td style="text-align: center; border-left: 1px solid #000000; border-right: 1px solid #000000">a</td>
									<td style="text-align: center; border-left: 1px solid #000000; border-right: 1px solid #000000">a</td>
									<td style="text-align: center; border-left: 1px solid #000000; border-right: 1px solid #000000">a</td>
									<td style="text-align: center; border-left: 1px solid #000000; border-right: 1px solid #000000">a</td>
								</tr>
								<tr>
									<td style="text-align: center; border-left: 1px solid; border-right: 1px solid; border-bottom: 1px solid"></td>
									<td style="border-bottom: 1px solid"></td>
									<td style="text-align: center; border-left: 1px solid; border-right: 1px solid; border-bottom: 1px solid"></td>
									<td style="text-align: center; border-left: 1px solid; border-right: 1px solid;border-bottom: 1px solid"></td>
									<td style="text-align: center; border-left: 1px solid; border-right: 1px solid; border-bottom: 1px solid"></td>
									<td style="text-align: center; border-left: 1px solid; border-right: 1px solid; border-bottom: 1px solid"></td>
									<td style="text-align: justify-all; border: 1px solid; font-size: 11px" colspan="3">
										<div class="row">
											<div class="col-6 q-pl-sm">
												Total Gross Amount: <br>
												Total Disc. Amount: <br>
												Total VAT Amount: <br>
											</div>
											<div class="col-6 text-right q-pr-sm">
												<span style="font-weight: bold;"> {{$helper.numberWithCommas(totalGross)}} BDT</span> <br>
												{{totalDiscount === 0? '-' : $helper.numberWithCommas(totalDiscount)}} BDT<br>
												0% BDT<br>
											</div>
										</div>
										<div class="row" style="background: rgb(188, 189, 192);">
											<div class="col-6 q-pl-sm">
												Total Payable Amount:
											</div>
											<div class="col-6 text-bold text-right q-pr-sm">
												{{$helper.numberWithCommas(invoiceData.totalMRP)}} BDT
											</div>
										</div>
									</td>
								</tr>
							</table>
						</div>
						<div class="row">
							<div class="col-md-8">
								<div>
									<table style="width: 350px; margin-left: 36px; margin-top: 10px">
										<tr>
											<td style="border: 1px solid #000000; width: 161px; height: 95px;">
												<hr style="width: 65%; margin-top: 35%; margin-bottom: 0">
												<p style="font-size: 10px; text-align: center; margin-top: 5px">Client Signature & Seal</p>
											</td>
											<td style="padding-left: 15px">
												<p style="font-size: 14px; margin-bottom: 2px; margin-top: 0">Payment Method:</p>
												<p style="font-size: 18px; font-weight: bold; margin-bottom: 2px; margin-top: 0">{{invoiceData.paymentType}}</p>
												<p style="font-size: 14px; margin-bottom: 2px; margin-top: 0">Payment Period:</p>
												<p style="font-size: 18px; font-weight: bold; margin-bottom: 2px; margin-top: 0">
													{{invoiceData.paymentType === 'Cash'? '-' : $helper.convertDate(invoiceData.creditPeriod)}}</p>
											</td>
										</tr>
									</table>
								</div>
								<div>
									<table style="width: 450px; margin-left: 36px; margin-top: 10px">
										<tr>
											<td style="border: 1px solid #000000; width: 161px; height: 95px;">
												<hr style="width: 65%; margin-top: 35%; margin-bottom: 0">
												<p style="font-size: 10px; text-align: center; margin-top: 5px">River Communication</p>
											</td>
											<td style="padding-left: 15px">
												<p style="font-size: 14px; margin-bottom: 2px; margin-top: 0">Product Details Hotline:</p>
												<p style="font-size: 18px; font-weight: bold; margin-bottom: 2px; margin-top: 0">+88(0)1993332100</p>
												<p style="font-size: 14px; margin-bottom: 2px; margin-top: 0; font-weight: bold">Terms & Condition:</p>
												<p style="font-size: 9px; margin-bottom: 2px; margin-top: 0; text-align: justify">Once sold product is NON
													RETURNABLE until without prior notice and proper authorization</p>
											</td>
										</tr>
									</table>
								</div>
							</div>
							<div class="col-md-4 text-center">
								<q-img src="images/qrcode.png" width="200px" style="margin: 9px 21px 8px 13px; border: 1px solid;"/>
							</div>
						</div>
						<div class="text-center" style="font-size: 10px; margin-top: 20px">
							This is a CRM Software generated Invoice. For details, scan the QR Code or contact with River Communication
						</div>
						<div class="row" style="font-size: 11px; margin-top: 20px; margin-left: 36px; margin-right: 36px">
							<div class="col-6">
								House: 1191, Avenue: 12, Road: 10, Mirpur DOHS, Dhaka - 1216 <br>
								<span class="text-bold">www.rivercommunication.com</span>
							</div>
							<div class="col-6 text-right">
								Cell: +88(0)1717150423, +88(0)17198123986 <br>
								E-Mail: dis.rivercommunication@gmail.com
							</div>
						</div>
					</div>
				</div>
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {AxiosResponseInterface} from "src/customs/interfaces/axios-response.interface";
import {ResponseStatusEnum} from "src/customs/enum/response-status.enum";
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';

@Component({})
export default class List extends Vue {

	tableLength: number = 0
	invoiceID : any
	invoiceData: any[] = []
	totalGross: number = 0
	totalDiscount: number = 0

	created() {
		const urlParams = new URLSearchParams(window.location.search);
		this.invoiceID = urlParams.get('id');
		this.getInvoiceByID();
	}

	getInvoiceByID() {
		let url = 'invoice/' + this.invoiceID
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
						this.invoiceData = res.payload.data || []
						//@ts-ignore
						this.tableLength = 16 - this.invoiceData.invoiceDetails.length;
						//@ts-ignore
						this.invoiceData.invoiceDetails.forEach((item) => {
							this.totalGross += (item.unitMRP * item.quantity);
							this.totalDiscount += ((item.unitMRP * item.quantity * item.discount) / 100);
						})
						setTimeout(()=> {
							this.downloadWithCSS()
						}, 1000)
					}
				}
			}
		})
	}

	downloadWithCSS() {
		//@ts-ignore
		const invoiceID = this.invoiceData.invoiceID;
		const doc = new jsPDF();
		/** WITH CSS */
		//@ts-ignore
		html2canvas(this.$refs.content).then(function (canvas) {
			const img = canvas.toDataURL("image/jpeg", 2.0);
			//@ts-ignore
			doc.addImage(img,'JPEG', 0,0);
			doc.save("Invoice "+invoiceID+".pdf");
		});
	}

}
</script>


<style scoped>
body {
	background: rgb(204,204,204);
}
.page {
	background: url('InvoiceBG.png');
	background-size: 21cm 29.7cm;
	display: block;
	margin: 0 auto 0.5cm;
	width: 21cm;
	height: 29.7cm;
	font-family: 'Montserrat', sans-serif;
	/*box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);*/
}

table {
	border-collapse: collapse;
	width: 100%;
	font-size: 10px;
}

th {
	border: 1px solid #535355;
	text-align: center;
	padding: 8px;
	background: #535355;
	color: #ffffff;
}
</style>
