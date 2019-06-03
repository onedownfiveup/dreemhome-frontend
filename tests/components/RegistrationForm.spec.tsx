import React from 'react'
import {render, fireEvent, cleanup} from 'react-testing-library'
import RegistrationForm from '@dreemhome/components/registration/RegistrationForm'
import ApiClient from '@dreemhome/util/ApiClient'
import axios, { AxiosPromise } from 'axios'
import 'jest-dom/extend-expect'

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
test('form initial state is the phone verification form', () => {
  const {getByTestId} = render(<RegistrationForm />)

  expect(getByTestId('phone-verification')).toBeDefined
})

test('renders the code confirmation screen when user clicks next', async () => {
  const { getByTestId, getByText, getByLabelText } = render(<RegistrationForm />)
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
