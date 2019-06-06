import { PhoneNumber } from '@dreemhome/entities/PhoneNumber'

export interface User {
  id?: string
  attributes: {
    first_name?: string
    last_name?: string
    postal_code?: string
    email?: string
  }
}
