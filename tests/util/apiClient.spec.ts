import axios, { AxiosPromise } from 'axios'
import ApiClient from 'util/apiClient'
import { User } from '@dreemhome/entities/User'
import { PartnerInvite } from '@dreemhome/entities/PartnerInvite'

const axiosMock = axios as jest.Mocked<typeof axios>;

const apiClient = new ApiClient()
const number = '222-232-2232'

afterEach(() => {
  axiosMock.post.mockReset
  axiosMock.get.mockReset
})

describe("verifyPhoneNumber", () => {
  axiosMock.get.mockImplementation(() =>
    Promise.resolve({
      "data": {
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
    }) as AxiosPromise
  )

  test('verify phone number makes appropriate API call', async () => {
    apiClient.verifyPhoneNumber(number)
    expect(axiosMock.get).toHaveBeenCalledTimes(1);
    expect(axiosMock.get).toHaveBeenCalledWith(
      `${apiClient.baseUrl}/phone_numbers/verify?phone_number=${number}`
    )
  })
})

describe("ApiClient.verifyPhoneCode", () => {
  axiosMock.post.mockImplementation(() =>
    Promise.resolve({
      "data": {
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
    }) as AxiosPromise
  )
  const code = '1234'
  const phoneNumberId = '1111-2222'

  test('verify phone code makes appropriate API call', () => {
    apiClient.verifyPhoneCode(phoneNumberId, code)
    expect(axiosMock.post).toHaveBeenCalledTimes(1);
    expect(axiosMock.post).toHaveBeenCalledWith(
      `${apiClient.baseUrl}/phone_numbers/verify/${phoneNumberId}`,
      { code: code }
    )
  })
})

describe("ApiClient.createUser", () => {
  const firstName = "John"
  const lastName = "Mccain"
  const email = "jmc@example.com"
  const postalCode = "11217"

  axiosMock.post.mockImplementation(() =>
    Promise.resolve({
      "data": {
        "data": {
          "id": "cc167653-2f2e-44c9-9723-ea166f24ea56",
          "type": "user",
          "attributes": {
            "created_at": "2019-06-02 15:46:38 +0000",
            "updated_at": "2019-06-02 15:46:38 +0000",
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "postal_code": postalCode
          }
        }
      }
    }) as AxiosPromise
  )
  const user: User = {
    attributes: {
      first_name: firstName,
      last_name: lastName,
      postal_code: postalCode,
      email: email
    }
  }

  test('createUser code makes appropriate API call', () => {
    apiClient.createUser(user)

    expect(axiosMock.post).toHaveBeenCalledWith(
      `${apiClient.baseUrl}/users`, {
        data: {...user}
      }
    )
  })
})


describe("ApiClient.createPartnerInvite", () => {
  const firstName = "John"
  const lastName = "Mccain"
  const email = "jmc@example.com"
  const partnerInvite: PartnerInvite = {
    attributes: {
      first_name: firstName,
      last_name: lastName,
      email: email
    }
  }
  const user: User = {
    attributes: {
      id: '1234',
    }
  }


  axiosMock.post.mockImplementation(() =>
    Promise.resolve({
      "data": {
        "data": {
          "id": "cc167653-2f2e-44c9-9723-ea166f24ea56",
          "type": "partner_invite",
          "attributes": {
            "created_at": "2019-06-02 15:46:38 +0000",
            "updated_at": "2019-06-02 15:46:38 +0000",
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
          }
        }
      }
    }) as AxiosPromise
  )

  test('createUser code makes appropriate API call', () => {
    apiClient.createPartnerInvite(partnerInvite, user.id)

    expect(axiosMock.post).toHaveBeenCalledWith(
      `${apiClient.baseUrl}/users/${user.id}/partner_invites`,{
        data: {...partnerInvite}
      }
    )
  })
})
