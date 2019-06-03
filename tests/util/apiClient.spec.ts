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

  test('verify phone number makes appropriate API call', (done) => {
    apiClient.verifyPhoneNumber(number, (phoneNumber: PhoneNumber) => {
      expect(axiosMock.get).toHaveBeenCalledTimes(1);
      expect(axiosMock.get).toHaveBeenCalledWith(
        `${apiClient.baseUrl}/phone_numbers/verify?phone_number=${number}`
      )
    })
      .then(done)
      .catch(done.fail);
  })

  test('verify phone number invokes callback with phonenumber', (done) => {
    apiClient.verifyPhoneNumber(number, (phoneNumber: PhoneNumber) => {
      expect(phoneNumber.number).toBe(number)
      expect(phoneNumber.id).toBe("cc167653-2f2e-44c9-9723-ea166f24ea56")
    })
      .then(done)
      .catch(done.fail);
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

  test('verify phone code makes appropriate API call', (done) => {
    apiClient.verifyPhoneCode(phoneNumberId, code, (phoneNumber: PhoneNumber) => {
      expect(axiosMock.post).toHaveBeenCalledTimes(1);
      expect(axiosMock.post).toHaveBeenCalledWith(
        `${apiClient.baseUrl}/phone_numbers/verify/${phoneNumberId}`,
        { code: code }
      )
    })
      .then(done)
      .catch(done.fail);
  })


  test('verify phone number invokes callback with phonenumber', (done) => {
    apiClient.verifyPhoneCode(phoneNumberId, code, (phoneNumber: PhoneNumber) => {
      expect(phoneNumber.number).toBe(number)
      expect(phoneNumber.id).toBe("cc167653-2f2e-44c9-9723-ea166f24ea56")
    })
      .then(done)
      .catch(done.fail);
  })
})
