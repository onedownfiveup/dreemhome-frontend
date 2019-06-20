export interface PartnerInvite {
  id?: string
  attributes: PartnerInviteAttributes
}

export interface PartnerInviteAttributes {
  first_name ?: string
  last_name ?: string
  email ?: string
  wedding_registry_id?: string
}
