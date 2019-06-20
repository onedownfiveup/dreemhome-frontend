import axios from 'axios'
import ApiClient from 'util/apiClient'
import { User, UserAttributes } from '@dreemhome/entities/User'
import { PartnerInviteAttributes } from '@dreemhome/entities/PartnerInvite'
import MockAdapter from 'axios-mock-adapter'

const apiClient = new ApiClient()
const number = '222-232-2232'
const mock = new MockAdapter(axios)

afterEach(() => {
  mock.reset()
})

describe("verifyPhoneNumber", () => {
  mock.onGet(new RegExp(`${apiClient.baseUrl}/phone_numbers/verify/*`)).reply(
    200,
    {
      "data": {
        "id": "cc167653-2f2e-44c9-9723-ea166f24ea56",
        "type": "phone_number",
        "attributes": {
          "created_at": "2019-06-02 15:46:38 +0000",
          "number": number,
          "twilio_sid": "1234",
          "status": "unverified",
          "updated_at": "2019-06-02 15:46:38 +0000"
        }
      }
    }
  )

  test('verify phone number makes appropriate API call', async () => {
    await apiClient.verifyPhoneNumber(number)
    expect(mock.history.get.length).toBe(1)
    expect(mock.history.get[0].url).toBe(
      `${apiClient.baseUrl}/phone_numbers/verify?phone_number=${number}`
    )
  })
})

describe("ApiClient.verifyPhoneCode", () => {
  test('verify phone code makes appropriate API call', async () => {
    mock.onPost(new RegExp(`${apiClient.baseUrl}/phone_numbers/verify/*`)).reply(
      200,
      {
        "data": {
          "id": "cc167653-2f2e-44c9-9723-ea166f24ea56",
          "type": "phone_number",
          "attributes": {
            "created_at": "2019-06-02 15:46:38 +0000",
            "number": number,
            "twilio_sid": "1234",
            "status": "verified",
            "updated_at": "2019-06-02 15:46:38 +0000"
          }
        }
      }
    )
    const code = '1234'
    const phoneNumberId = '1111-2222'

    await apiClient.verifyPhoneCode(phoneNumberId, code)
    expect(mock.history.post.length).toBe(1)
    await expect(mock.history.post[0].url).toBe(
      `${apiClient.baseUrl}/phone_numbers/verify/${phoneNumberId}`
    )
    expect(mock.history.post[0].data).toBe(JSON.stringify({ code: code }))
  })
})

describe("ApiClient.createUser", () => {
  test('createUser code makes appropriate API call', async () => {
    const firstName = "John"
    const lastName = "Mccain"
    const email = "jmc@example.com"
    const postalCode = "11217"

    mock.onPost(new RegExp(`${apiClient.baseUrl}/users$`)).reply(
      200,
      {
        "data": {
          "id": "cc167653-2f2e-44c9-9723-ea166f24ea56",
          "type": "user",
          "attributes": {
            "created_at": "2019-06-02 15:46:38 +0000",
            "updated_at": "2019-06-02 15:46:38 +0000",
            "first_name": "John",
            "last_name": "Palmer",
            "email": "john@example.com",
            "postal_code": "11215"
          }
        }
      }
    )
    const userAttributes: UserAttributes = {
      first_name: firstName,
      last_name: lastName,
      postal_code: postalCode,
      email: email
    }

    await apiClient.createUser(userAttributes)

    expect(mock.history.post[0].url).toBe(`${apiClient.baseUrl}/users`)
    expect(mock.history.post[0].data).toBe(
      JSON.stringify({
        data: {
          attributes: { ...userAttributes }
        }
      })
    )
  })
})

describe("ApiClient.createPartnerInvite", () => {
  test('createUser code makes appropriate API call', async () => {
    const firstName = "John"
    const lastName = "Mccain"
    const email = "jmc@example.com"
    const partnerInviteAttributes: PartnerInviteAttributes = {
      first_name: firstName,
      last_name: lastName,
      email: email
    }
    const user: User = {
      attributes: {
        id: '1234',
      }
    }
    mock.onPost(new RegExp(`${apiClient.baseUrl}/users/.*/partner_invites`)).reply(
      200,
      {
        'data': {
          "id": 'a valid id',
          'type': 'partner_invite',
          'attributes': {
            'email': 'email@rmail.com',
            "created_at": "2019-06-02 15:46:38 +0000",
            "updated_at": "2019-06-02 15:46:38 +0000",
            'first_name': 'Nancy',
            'last_name': 'Regan',
            'wedding_registry_id': '1234'
          }
        }
      }
    )

    await apiClient.createPartnerInvite(partnerInviteAttributes, user.id)

    expect(mock.history.post[0].url).toBe(
      `${apiClient.baseUrl}/users/${user.id}/partner_invites`
    )
    expect(mock.history.post[0].data).toBe(
      JSON.stringify({
        data: {
          attributes: { ...partnerInviteAttributes }
        }
      })
    )
  })
})

describe('createCharge', () => {
  const creditCardAttributes = {
    name: "John Dough",
    card_number: "1234-56789-1011",
    expiration_date: "10/10/2044",
    ccv: '1234',
    postal_code: '90210',
    wedding_registry_id: "cc167653-2f2e-44c9-9723-ea166f24ea56"
  }

  test('that it calls the charge endpoint with the token parameter', async () => {
    const weddingRegistryId = '1234'

    mock.onPost(new RegExp(`${apiClient.baseUrl}/wedding_registries/${weddingRegistryId}/charge`)).reply(
      200,
      {
        'data': {
          "id": 'a valid id',
          'type': 'charge',
          'attributes': {
            "created_at": "2019-06-02 15:46:38 +0000",
            "updated_at": "2019-06-02 15:46:38 +0000",
            'wedding_registry_id': weddingRegistryId
          }
        }
      }
    )

    await apiClient.createCharge(weddingRegistryId, creditCardAttributes)

    expect(mock.history.post[0].url).toBe(
      `${apiClient.baseUrl}/wedding_registries/${weddingRegistryId}/charge`
    )
    expect(mock.history.post[0].data).toBe(
      JSON.stringify({
        data: {
          attributes: { ...creditCardAttributes }
        }
      })
    )
  })
})
