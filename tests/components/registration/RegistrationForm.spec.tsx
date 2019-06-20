import React from 'react'
import {render, fireEvent, cleanup, waitForElement, Matcher, SelectorMatcherOptions} from 'react-testing-library'
import RegistrationForm from '@dreemhome/components/registration/RegistrationForm'
import PhoneVerification from '@dreemhome/components/registration/PhoneVerification'
import ApiClient from '@dreemhome/util/ApiClient'
import axios, { AxiosPromise } from 'axios'
import 'jest-dom/extend-expect'
import MockAdapter from 'axios-mock-adapter'

const apiClient = new ApiClient()
const number = '222-232-2232'
const phoneNumberId = "cc167653-2f2e-44c9-9723-ea166f24ea56"
const mock = new MockAdapter(axios)

afterEach(() => {
  mock.reset()
  cleanup()
})

beforeEach(() => {
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
})

test('form initial state is the phone verification form', () => {
  const {getByTestId} = render(<RegistrationForm />)

  expect(getByTestId('phone-verification')).toBeDefined
})

test('user registers succesfully', async () => {
  const { getByText, getByLabelText, getByTestId } = render(<RegistrationForm />)
  const phoneNumberInput = getByLabelText('Phone number')
  const code = '1234'

  fireEvent.change(phoneNumberInput, { target: { value: number } })
  await fireEvent.click(getByText('Next'))

  const confirmationElement = await waitForElement(() => getByText("Confirmation Time"));
  expect(confirmationElement).toBeDefined()

  const codeInput = getByLabelText('Verification code')

  fireEvent.change(codeInput, { target: { value: code } })
  await fireEvent.click(getByText('Next'))

  await waitForElement(() => getByText("Tell us about yourself"));
  fillOutUserInfoForm(getByLabelText, getByText)

  await waitForElement(() => getByText("Tell us about your partner"));
  fillOutPartnerForm(getByLabelText, getByText)

  await waitForElement(() => getByText("Pay your fee motherfucker"));
  fillOutCreditCardForm(getByLabelText, getByText, getByTestId)
})

const fillOutCreditCardForm = async (
  getByLabelText: (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement,
  getByText: (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement,
  getByTestId: (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement
) => {
  const cardHolderNameInput = getByLabelText('Card Holder Name')
  fireEvent.change(cardHolderNameInput, { target: { value: 'John Schnickens'} })

  const cardNumberInput = getByLabelText('Card Number')
  fireEvent.change(cardNumberInput, { target: { value: '1234-567890-7890'} })

  const ccvInput = getByLabelText('CCV')
  fireEvent.change(ccvInput, { target: { value: '2343'} })

  const postalCodeInput = getByLabelText('Postal Code')
  fireEvent.change(postalCodeInput, { target: { value: '11213'} })

  await fireEvent.click(getByText('Next'))
}

const fillOutUserInfoForm = async (
  getByLabelText: (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement,
  getByText: (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement
) => {
  const firstNameInput = getByLabelText('First name')
  fireEvent.change(firstNameInput, { target: { value: 'John'} })

  const lastNameInput = getByLabelText('Last name')
  fireEvent.change(lastNameInput, { target: { value: 'Palmer'} })

  const postalCodeInput = getByLabelText('Postal code')
  fireEvent.change(postalCodeInput, { target: { value: '11215'} })

  const emailInput = getByLabelText('Email address')
  fireEvent.change(emailInput, { target: { value: 'test@example.com'} })
  await fireEvent.click(getByText('Next'))
}

const fillOutPartnerForm = async (
  getByLabelText: (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement,
  getByText: (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement
) => {
  const firstNameInput = getByLabelText('First name')
  fireEvent.change(firstNameInput, { target: { value: 'John'} })

  const lastNameInput = getByLabelText('Last name')
  fireEvent.change(lastNameInput, { target: { value: 'Palmer'} })

  const emailInput = getByLabelText('Email address')
  fireEvent.change(emailInput, { target: { value: 'test@example.com'} })

  await fireEvent.click(getByText('Next'))
}
