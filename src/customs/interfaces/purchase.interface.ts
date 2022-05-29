interface purchaseDetailsInterface {
	productID: string
	unitTP: number
	quantity: number
}

export interface PurchaseInterface {
	id?: string
	purchaseDate: Date | string
	totalAmount: number
	createPurchaseDetailsDto: purchaseDetailsInterface[]
}
