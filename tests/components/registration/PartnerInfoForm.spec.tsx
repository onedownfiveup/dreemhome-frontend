import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import PartnerInfoForm from '@dreemhome/components/registration/PartnerInfoForm'
import axios from 'axios'
import ApiClient from '@dreemhome/util/apiClient'
import MockAdapter from 'axios-mock-adapter'

const axiosMock = axios as jest.Mocked<typeof axios>;
const apiClient = new ApiClient()
const email = 'test@example.com'
const lastName = 'Palmer'
const firstName = 'John'
const postalCode = '11215'
const userId = "cc167653-2f2e-44c9-9723-ea166f24ea56"
const mock = new MockAdapter(axios)


afterEach(() => {
  mock.reset()
  cleanup()
})

beforeEach(() => {
  mock.onPost(new RegExp(`${apiClient.baseUrl}/users/.*/partner_invites`)).reply(
    200,
    {
      'data': {
        "id": userId,
        'type': 'partner_invite',
        'attributes': {
          'email': email,
          "created_at": "2019-06-02 15:46:38 +0000",
          "updated_at": "2019-06-02 15:46:38 +0000",
          'first_name': firstName,
          'last_name': lastName,
          'wedding_registry_id': '1234'
        }
      }
    }
  )
})

it('sends a request to the server to create a user', async () => {
  const { getByText, getByLabelText } = render(
    <PartnerInfoForm partnerCreatedCallback={jest.fn()} userId={userId}/>
  )
  await waitForElement(() => getByText("Tell us about your partner"));

  const firstNameInput = getByLabelText('First name')
  fireEvent.change(firstNameInput, { target: { value: firstName} })

  const lastNameInput = getByLabelText('Last name')
  fireEvent.change(lastNameInput, { target: { value: lastName } })

  const emailInput = getByLabelText('Email address')
  fireEvent.change(emailInput, { target: { value: email } })

  await fireEvent.click(getByText('Next'))

  await expect(mock.history.post[0].url).toBe(`${apiClient.baseUrl}/users/${userId}/partner_invites`)
  await expect(mock.history.post[0].data).toBe(
    JSON.stringify({
      data: {
        attributes: {
          first_name: firstName,
          last_name: lastName,
          email: email
        }
      }
    })
  )
})

it('makes a call to the callback with the updated user', async () => {
  const callback = jest.fn()
  const {
    getByText,
    getByLabelText
  } = render(<PartnerInfoForm partnerCreatedCallback={callback} userId={userId} />)

  await waitForElement(() => getByText("Tell us about your partner"));

  const firstNameInput = getByLabelText('First name')
  fireEvent.change(firstNameInput, { target: { value: firstName} })

  const lastNameInput = getByLabelText('Last name')
  fireEvent.change(lastNameInput, { target: { value: lastName} })

  const emailInput = getByLabelText('Email address')
  fireEvent.change(emailInput, { target: { value: email} })

  await fireEvent.click(getByText('Next'))

  await waitForElement(() => getByText("Tell us about your partner"));
  await expect(callback).toHaveBeenCalledWith({
    id: userId,
    type: "partner_invite",
    attributes: {
      first_name: firstName,
      last_name: lastName,
      email: email,
      wedding_registry_id: '1234',
      created_at: "2019-06-02 15:46:38 +0000",
      updated_at: "2019-06-02 15:46:38 +0000",
    }
  })
})
