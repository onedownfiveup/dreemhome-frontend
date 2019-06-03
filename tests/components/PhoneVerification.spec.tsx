import React from 'react'
import {render, fireEvent, cleanup, getByTestId, act} from 'react-testing-library'
import 'jest-dom/extend-expect'
import PhoneVerification from '@dreemhome/components/registration/PhoneVerification'
import axios, { AxiosPromise } from 'axios'
import ApiClient from '@dreemhome/util/apiClient'

const axiosMock = axios as jest.Mocked<typeof axios>;
const callBack = jest.fn()
const apiClient = new ApiClient()

afterEach(cleanup)

const number = '222-232-2232'
const phoneNumberId = "cc167653-2f2e-44c9-9723-ea166f24ea56"

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

test('sends a request to the server to verify the phone number', async () => {
  const { getByText, getByLabelText } = render(<PhoneVerification handleUserChanged={callBack} />)
  const input = getByLabelText('Phone number')

  fireEvent.change(input, { target: { value: number } })
  fireEvent.click(getByText('Next'))

  await expect(axiosMock.get).toHaveBeenCalledWith(`${apiClient.baseUrl}/phone_numbers/verify?phone_number=${number}`)
  await expect(getByText("Confirmation Time")).toBeDefined()
})

test('user verifies their phone number', async () => {
  const {getByText, getByLabelText} = render(<PhoneVerification handleUserChanged={callBack}/>)
  const phoneNumberInput = getByLabelText('Phone number')
  const code = '1234'

  fireEvent.change(phoneNumberInput , { target: { value: number } })
  await fireEvent.click(getByText('Next'))

  expect(getByText("Confirmation Time")).toBeDefined()

  const codeInput = getByLabelText('Verification code')

  fireEvent.change(codeInput, { target: { value: code } })
  await fireEvent.click(getByText('Next'))

  await expect(axiosMock.post).toHaveBeenCalledWith(
    `${apiClient.baseUrl}/phone_numbers/verify/${phoneNumberId}`,
    { code: code }
  )
})
