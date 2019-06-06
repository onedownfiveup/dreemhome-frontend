import React from 'react'
import {render, fireEvent, cleanup, waitForElement} from 'react-testing-library'
import RegistrationForm from '@dreemhome/components/registration/RegistrationForm'
import PhoneVerification from '@dreemhome/components/registration/PhoneVerification'
import ApiClient from '@dreemhome/util/ApiClient'
import axios, { AxiosPromise } from 'axios'
import 'jest-dom/extend-expect'

const axiosMock = axios as jest.Mocked<typeof axios>;
const callBack = jest.fn()
const apiClient = new ApiClient()
const number = '222-232-2232'
const phoneNumberId = "cc167653-2f2e-44c9-9723-ea166f24ea56"

afterEach(() => {
  cleanup
  axiosMock.get.mockReset()
  axiosMock.post.mockReset()
})

beforeEach(() => {
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
            "status": "verified",
            "updated_at": "2019-06-02 15:46:38 +0000"
          }
        }
      }
    }) as AxiosPromise
  )
})

test('form initial state is the phone verification form', () => {
  const {getByTestId} = render(<RegistrationForm />)

  expect(getByTestId('phone-verification')).toBeDefined
})

test('user registers succesfully', async () => {
  const { getByText, getByLabelText, rerender } = render(<RegistrationForm />)
  const phoneNumberInput = getByLabelText('Phone number')
  const code = '1234'

  fireEvent.change(phoneNumberInput, { target: { value: number } })
  await fireEvent.click(getByText('Next'))

  const confirmationElement = await waitForElement(() => getByText("Confirmation Time"));
  expect(confirmationElement).toBeDefined()

  const codeInput = getByLabelText('Verification code')

  fireEvent.change(codeInput, { target: { value: code } })
  await fireEvent.click(getByText('Next'))

  await expect(axiosMock.post).toHaveBeenCalledWith(
    `${apiClient.baseUrl}/phone_numbers/verify/${phoneNumberId}`,
    { code: code }
  )

  await waitForElement(() => getByText("Tell us about yourself"));

  const firstNameInput = getByLabelText('First name')
  fireEvent.change(firstNameInput, { target: { value: 'John'} })

  const lastNameInput = getByLabelText('Last name')
  fireEvent.change(lastNameInput, { target: { value: 'Palmer'} })

  const postalCodeInput = getByLabelText('Postal code')
  fireEvent.change(postalCodeInput, { target: { value: '11215'} })

  const emailInput = getByLabelText('Email address')
  fireEvent.change(emailInput, { target: { value: 'test@example.com'} })

  await fireEvent.click(getByText('Next'))
  await waitForElement(() => getByText("Tell us about your partner"));
})
