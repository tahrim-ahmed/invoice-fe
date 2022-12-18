interface purchaseDetailsInterface {
	productID: string
	unitPrice: number
	quantity: number
}

export interface PurchaseInterface {
	id?: string
	purchaseDate: Date | string
	totalPrice: number
	type: string
	createPurchaseDetailsDto: purchaseDetailsInterface[]
}
