import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import PaymentInfoForm from '@dreemhome/components/registration/PaymentInfoForm'
import axios from 'axios'
import ApiClient from '@dreemhome/util/apiClient'
import MockAdapter from 'axios-mock-adapter'

const axiosMock = axios as jest.Mocked<typeof axios>;
const apiClient = new ApiClient()
const chargeId = "cc167653-2f2e-44c9-9723-ea166f24ea56"
const name = "John Dough"
const cardNumber = "1234-56789-1011"
const expirationDate = "10/10/2044"
const ccv = '1234'
const postalCode = '90210'
const weddingRegistryId = "cc167653-2f2e-44c9-9723-ea166f24ea56"
const mock = new MockAdapter(axios)

afterEach(() => {
  cleanup()
  mock.reset()
})

beforeEach(() => {
  mock.onPost(new RegExp(`${apiClient.baseUrl}/wedding_registries/${weddingRegistryId}/charge`)).reply(
    200,
    {
      'data': {
        "id": chargeId,
        'type': 'charge',
        'attributes': {
          "created_at": "2019-06-02 15:46:38 +0000",
          "updated_at": "2019-06-02 15:46:38 +0000",
          'wedding_registry_id': weddingRegistryId
        }
      }
    }
  )
})

it('sends a request to the server to create the charge', async () => {
  const { getByText, getByLabelText } = render(
    <PaymentInfoForm weddingRegistryId={weddingRegistryId}/>
  )

  await fillOutPartnerForm(getByLabelText, getByText)

  await expect(mock.history.post[0].url).toBe(
    `${apiClient.baseUrl}/wedding_registries/${weddingRegistryId}/charge`
  )
  await expect(mock.history.post[0].data).toBe(
    JSON.stringify({
      data: {
        attributes: {
          name: "John Dough",
          number: "1234-56789-1011",
          ccv: '1234',
          expiration_date: "10/10/2044",
          postal_code: '90210',
          wedding_registry_id: weddingRegistryId
        }
      }
    })
  )
})

it('makes a call to the callback with the created charge', async () => {
  const callback = jest.fn()
  const { getByText, getByLabelText } = render(
    <PaymentInfoForm weddingRegistryId={weddingRegistryId} callback={callback}/>
  )

  await fillOutPartnerForm(getByLabelText, getByText)
  await expect(callback).toHaveBeenCalledWith({
    id: chargeId,
    type: "charge",
    attributes: {
      wedding_registry_id: weddingRegistryId,
      created_at: "2019-06-02 15:46:38 +0000",
      updated_at: "2019-06-02 15:46:38 +0000",
    }
  })
})

const fillOutPartnerForm = async (
  getByLabelText: (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement,
  getByText: (text: Matcher, options?: SelectorMatcherOptions) => HTMLElement
) => {
  await waitForElement(() => getByText("Pay your fee motherfucker"));

  const nameInput = getByLabelText('Name')
  fireEvent.change(nameInput, { target: { value: name } })

  const cardNumberInput = getByLabelText('Card number')
  fireEvent.change(cardNumberInput, { target: { value: cardNumber } })

  const expirationDateInput = getByLabelText('Expiration date')
  fireEvent.change(expirationDateInput, { target: { value: expirationDate } })

  const CCVInput = getByLabelText('CCV')
  fireEvent.change(CCVInput, { target: { value: ccv } })

  const postalCodeInput = getByLabelText('Postal code')
  await fireEvent.change(postalCodeInput, { target: { value: postalCode } })

  await fireEvent.click(getByText('Next'))
  await waitForElement(() => getByText("Pay your fee motherfucker"));
}
