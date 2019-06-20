import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  waitForElement
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import PhoneVerification from '@dreemhome/components/registration/PhoneVerification'
import axios, { AxiosPromise } from 'axios'
import ApiClient from '@dreemhome/util/apiClient'
import MockAdapter from 'axios-mock-adapter'

const callBack = jest.fn()
const apiClient = new ApiClient()
const number = '222-232-2232'
const phoneNumberId = "cc167653-2f2e-44c9-9723-ea166f24ea56"
const mock = new MockAdapter(axios)

afterEach(() => {
  cleanup
  mock.reset()
})

beforeEach(() => {
  const getVerifyUrl = new RegExp(`${apiClient.baseUrl}/phone_numbers/verify/*`);

  mock.onGet(getVerifyUrl).reply(
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

  const postVerifytUrl = new RegExp(`${apiClient.baseUrl}/phone_numbers/verify/*`)
  mock.onPost(postVerifytUrl).reply(
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
})

test('sends a request to the server to verify the phone number', async () => {
  const { getByText, getByLabelText, rerender } = render(<PhoneVerification handleUserChanged={callBack} />)
  const input = getByLabelText('Phone number')

  fireEvent.change(input, { target: { value: number } })
  await fireEvent.click(getByText('Next'))

  await expect(mock.history.get[0].url).toBe(`${apiClient.baseUrl}/phone_numbers/verify?phone_number=${number}`)

  const confirmationElement = await waitForElement(() => getByText("Confirmation Time"));
  expect(confirmationElement).toBeDefined()
})

test('user verifies their phone number', async () => {
  const { getByText, getByLabelText, rerender } = render(<PhoneVerification  handleVerified={callBack} />)
  const phoneNumberInput = getByLabelText('Phone number')
  const code = '1234'

  fireEvent.change(phoneNumberInput, { target: { value: number } })
  await fireEvent.click(getByText('Next'))

  const confirmationElement = await waitForElement(() => getByText("Confirmation Time"));
  expect(confirmationElement).toBeDefined()

  const codeInput = getByLabelText('Verification code')

  fireEvent.change(codeInput, { target: { value: code } })
  await fireEvent.click(getByText('Next'))

  await expect(mock.history.post[0].url).toBe(`${apiClient.baseUrl}/phone_numbers/verify/${phoneNumberId}`)
  await expect(mock.history.post[0].data).toBe(JSON.stringify({ code: code }))

  await waitForElement(() => getByText("Confirmation Time"));
  expect(callBack).toHaveBeenCalledWith({
    id: phoneNumberId,
    type: "phone_number",
    attributes: {
      number: number,
      created_at: "2019-06-02 15:46:38 +0000",
      status: "verified",
      twilio_sid: "1234",
      updated_at: "2019-06-02 15:46:38 +0000",
    }
  })
})

describe('error messaging', () => {
  test('user sees error if phone verification fails', async () => {
    const getVerifyUrl = new RegExp(`${apiClient.baseUrl}/phone_numbers/verify/*`);

    mock.onGet(getVerifyUrl).reply(
      400,
      {
        "errors": [{
          "detail": "Voodoo doodoo",
          "id": "cc167653-2f2e-44c9-9723-ea166f24ea56",
          "status": "bad_request"
        }],
      }
    )

    const { getByText, getByLabelText, getByTestId } = render(<PhoneVerification handleVerified={callBack} />)
    const phoneNumberInput = getByLabelText('Phone number')

    await fireEvent.change(phoneNumberInput, { target: { value: number } })
    await fireEvent.click(getByText('Next'))

    await waitForElement(() => getByText("Phone verification failed, please try again"));
  })

  test('user can re enter phone number after verification fails.', async () => {
    const { getByText, getByLabelText, getByTestId } = render(<PhoneVerification handleVerified={callBack} />)
    const phoneNumberInput = getByLabelText('Phone number')
    const getVerifyUrl = new RegExp(`${apiClient.baseUrl}/phone_numbers/verify/*`);

    mock.onGet(getVerifyUrl).reply(
      400,
      {
        "errors": [{
          "detail": "Voodoo doodoo",
          "id": "cc167653-2f2e-44c9-9723-ea166f24ea56",
          "status": "bad_request"
        }],
      }
    )
    await fireEvent.change(phoneNumberInput, { target: { value: number } })
    await fireEvent.click(getByText('Next'))
    await waitForElement(() => getByText("Phone verification failed, please try again"));

    mock.onGet(getVerifyUrl).reply(
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
    await fireEvent.click(getByTestId('notification-close-button'))
    await fireEvent.change(phoneNumberInput, { target: { value: number } })
    await fireEvent.click(getByText('Next'))

    await waitForElement(() => getByText("Confirmation Time"));
  })

  test('user sees error if code confirmation fails', async () => {
    const postVerifytUrl = new RegExp(`${apiClient.baseUrl}/phone_numbers/verify/*`)
    mock.onPost(postVerifytUrl).reply(
      400,
      {
        "errors": [{
          "detail": "Voodoo doodoo",
          "id": "cc167653-2f2e-44c9-9723-ea166f24ea56",
          "status": "bad_request"
        }],
      }
    )

    const { getByText, getByLabelText, getByTestId } = render(<PhoneVerification handleVerified={callBack} />)
    const phoneNumberInput = getByLabelText('Phone number')
    const code = '1234'

    await fireEvent.change(phoneNumberInput, { target: { value: number } })
    await fireEvent.click(getByText('Next'))

    const confirmationElement = await waitForElement(() => getByText("Confirmation Time"));
    expect(confirmationElement).toBeDefined()

    const codeInput = getByLabelText('Verification code')

    fireEvent.change(codeInput, { target: { value: code } })
    await fireEvent.click(getByText('Next'))

    await waitForElement(() => getByText("Code verification failed, please try again"));
  })

  test('user can re verification code after dismissing error notitification', async () => {
    const postVerifytUrl = new RegExp(`${apiClient.baseUrl}/phone_numbers/verify/*`)
    mock.onPost(postVerifytUrl).reply(
      400,
      {
        "errors": [{
          "detail": "Voodoo doodoo",
          "id": "cc167653-2f2e-44c9-9723-ea166f24ea56",
          "status": "bad_request"
        }],
      }
    )

    const { getByText, getByLabelText, getByTestId } = render(<PhoneVerification handleVerified={callBack} />)
    const phoneNumberInput = getByLabelText('Phone number')
    const code = '1234'

    await fireEvent.change(phoneNumberInput, { target: { value: number } })
    await fireEvent.click(getByText('Next'))

    const confirmationElement = await waitForElement(() => getByText("Confirmation Time"));
    expect(confirmationElement).toBeDefined()

    const codeInput = getByLabelText('Verification code')

    await fireEvent.change(codeInput, { target: { value: code } })
    await fireEvent.click(getByText('Next'))

    await waitForElement(() => getByText("Code verification failed, please try again"));

    await fireEvent.click(getByTestId('notification-close-button'))
    await fireEvent.change(phoneNumberInput, { target: { value: number } })
    await fireEvent.click(getByText('Next'))

    await expect(mock.history.post.length).toBe(2)
  })
})
