export interface User {
  id: string
  attributes: UserAttributes
}

export interface UserAttributes {
  first_name?: string
  last_name?: string
  postal_code?: string
  email?: string
  password?: string
}
