import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import UserInfoForm from '@dreemhome/components/registration/UserInfoForm'
import axios, { AxiosPromise } from 'axios'
import ApiClient from '@dreemhome/util/apiClient'

const axiosMock = axios as jest.Mocked<typeof axios>;
const callBack = jest.fn()
const apiClient = new ApiClient()
const email = 'test@example.com'
const lastName = 'Palmer'
const firstName = 'John'
const postalCode = '11215'
const userId = "cc167653-2f2e-44c9-9723-ea166f24ea56"

afterEach(() => {
  cleanup
  axiosMock.post.mockReset()
})

beforeEach(() => {
  axiosMock.post.mockImplementation(() =>
    Promise.resolve({
      "data": {
        'data': {
          "id": userId,
          'type': 'users',
          'attributes': {
            'email': email,
            "created_at": "2019-06-02 15:46:38 +0000",
            "updated_at": "2019-06-02 15:46:38 +0000",
            "postal_code": postalCode,
            'first_name': firstName,
            'last_name': lastName,
          }
        }
      }
    }) as AxiosPromise
  )
})

it('sends a request to the server to create a user', async () => {
  const { getByText, getByLabelText, rerender } = render(<UserInfoForm userCreatedCallback={jest.fn()}/>)
  await waitForElement(() => getByText("Tell us about yourself"));

  const firstNameInput = getByLabelText('First name')
  fireEvent.change(firstNameInput, { target: { value: firstName} })

  const lastNameInput = getByLabelText('Last name')
  fireEvent.change(lastNameInput, { target: { value: lastName } })

  const postalCodeInput = getByLabelText('Postal code')
  fireEvent.change(postalCodeInput, { target: { value: postalCode} })

  const emailInput = getByLabelText('Email address')
  fireEvent.change(emailInput, { target: { value: email } })

  await fireEvent.click(getByText('Next'))

  await expect(axiosMock.post).toHaveBeenCalledWith(
    `${apiClient.baseUrl}/users`,
    {
      data: {
        attributes: {
          first_name: firstName,
          last_name: lastName,
          postal_code: postalCode,
          email: email
        }
      }
    }
  )
})

it('makes a call to the callback with the updated user', async () => {
  const userCreatedCallback = jest.fn()
  const {
    getByText,
    getByLabelText
  } = render(<UserInfoForm userCreatedCallback={userCreatedCallback} />)

  await waitForElement(() => getByText("Tell us about yourself"));

  const firstNameInput = getByLabelText('First name')
  fireEvent.change(firstNameInput, { target: { value: firstName} })

  const lastNameInput = getByLabelText('Last name')
  fireEvent.change(lastNameInput, { target: { value: lastName} })

  const postalCodeInput = getByLabelText('Postal code')
  fireEvent.change(postalCodeInput, { target: { value: postalCode} })

  const emailInput = getByLabelText('Email address')
  fireEvent.change(emailInput, { target: { value: email} })

  await fireEvent.click(getByText('Next'))

  await expect(userCreatedCallback).toHaveBeenCalledWith({
    id: userId,
    type: "users",
    attributes: {
      first_name: firstName,
      last_name: lastName,
      postal_code: postalCode,
      email: email,
      created_at: "2019-06-02 15:46:38 +0000",
      updated_at: "2019-06-02 15:46:38 +0000",
    }
  })
})
