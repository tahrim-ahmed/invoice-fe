interface invoiceDetailsInterface {
	productID: string,
	discount: number
	unitTP: number
	unitMRP: number
	quantity: number
}

export interface InvoiceInterface {
	id?: string
	orderDate: Date | string
	shippingDate: Date | string
	clientID: string
	totalTP: number
	totalMRP: number
	totalCommission: number
	others: number
	totalProfit: number
	platform: string
	payment: string
	paymentType: string
	creditPeriod: Date | string
	createInvoiceDetailsDto: invoiceDetailsInterface[]
}
