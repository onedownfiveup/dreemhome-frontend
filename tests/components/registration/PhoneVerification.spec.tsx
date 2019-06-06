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

test('sends a request to the server to verify the phone number', async () => {
  const { getByText, getByLabelText, rerender } = render(<PhoneVerification handleUserChanged={callBack} />)
  const input = getByLabelText('Phone number')

  fireEvent.change(input, { target: { value: number } })
  await fireEvent.click(getByText('Next'))

  await expect(axiosMock.get).toHaveBeenCalledWith(`${apiClient.baseUrl}/phone_numbers/verify?phone_number=${number}`)

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

  await expect(axiosMock.post).toHaveBeenCalledWith(
    `${apiClient.baseUrl}/phone_numbers/verify/${phoneNumberId}`,
    { code: code }
  )

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
    axiosMock.get.mockImplementation(() =>
      Promise.reject({
        status: 400,
        data: {
          "errors": [{
            "detail": "Voodoo doodoo",
            "id": "cc167653-2f2e-44c9-9723-ea166f24ea56",
            "status": "bad_request"
          }],
        }
      }) as AxiosPromise
    )

    const { getByText, getByLabelText, getByTestId } = render(<PhoneVerification handleVerified={callBack} />)
    const phoneNumberInput = getByLabelText('Phone number')

    await fireEvent.change(phoneNumberInput, { target: { value: number } })
    await fireEvent.click(getByText('Next'))

    expect(getByText("Phone verification failed, please try again")).toBeDefined()
  })

  test('user can re enter phone number after verification fails.', async () => {
    axiosMock.get.mockImplementationOnce(() =>
      Promise.reject({
        status: 400,
        data: {
          "errors": [{
            "detail": "Voodoo doodoo",
            "id": "cc167653-2f2e-44c9-9723-ea166f24ea56",
            "status": "bad_request"
          }],
        }
      }) as AxiosPromise
    )

    const { getByText, getByLabelText, getByTestId } = render(<PhoneVerification handleVerified={callBack} />)
    const phoneNumberInput = getByLabelText('Phone number')

    await fireEvent.change(phoneNumberInput, { target: { value: number } })
    await fireEvent.click(getByText('Next'))

    expect(getByText("Phone verification failed, please try again")).toBeDefined()

    await fireEvent.click(getByTestId('notification-close-button'))
    await fireEvent.change(phoneNumberInput, { target: { value: number } })
    await fireEvent.click(getByText('Next'))

    await waitForElement(() => getByText("Confirmation Time"));
  })

  test('user sees error if code confirmation fails', async () => {
    axiosMock.post.mockImplementation(() =>
      Promise.reject({
        status: 400,
        data: {
          "errors": [{
            "detail": "Voodoo doodoo",
            "id": "cc167653-2f2e-44c9-9723-ea166f24ea56",
            "status": "bad_request"
          }],
        }
      }) as AxiosPromise
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

    expect(getByText("Code verification failed, please try again")).toBeDefined()
  })

  test('user can re verification code after dismissing error notitification', async () => {
    axiosMock.post.mockImplementation(() =>
      Promise.reject({
        status: 400,
        data: {
          "errors": [{
            "detail": "Voodoo doodoo",
            "id": "cc167653-2f2e-44c9-9723-ea166f24ea56",
            "status": "bad_request"
          }],
        }
      }) as AxiosPromise
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

    expect(getByText("Code verification failed, please try again")).toBeDefined()

    await fireEvent.click(getByTestId('notification-close-button'))
    await fireEvent.change(phoneNumberInput, { target: { value: number } })
    await fireEvent.click(getByText('Next'))

    await expect(axiosMock.post).toHaveBeenCalledTimes(2)
  })
})
