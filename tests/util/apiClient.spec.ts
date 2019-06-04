import axios, { AxiosPromise } from 'axios'
import ApiClient from 'util/apiClient'
import PhoneNumber from '@dreemhome/entities/PhoneNumber'
import { PointerEventHandler } from 'react';

const axiosMock = axios as jest.Mocked<typeof axios>;

const apiClient = new ApiClient()
const number = '222-232-2232'

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
