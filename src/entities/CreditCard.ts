export interface CreditCard {
  id?: string
  attributes: CreditCardAttributes
}

export interface CreditCardAttributes {
  name?: string
  number?: string
  ccv?: string
  expiration_date?: string
  postal_code?: string
  wedding_registry_id?: string
}
