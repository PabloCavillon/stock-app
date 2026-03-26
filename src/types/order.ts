export type SerializedOrderItem = {
  id: string
  productId: string
  orderId: string
  quantity: number
  unitPrice: number
  product: {
    id: string
    name: string
    sku: string
  }
}

export type SerializedOrder = {
  id: string
  customerId: string
  userId: string
  status: string
  total: number
  notes: string | null
  createdAt: string
  updatedAt: string
  customer: {
    id: string
    name: string
  }
  user: {
    id: string
    username: string
  }
  items: SerializedOrderItem[]
}