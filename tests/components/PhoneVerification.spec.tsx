import React from 'react'
import {render, fireEvent, cleanup, getByTestId} from 'react-testing-library'
import 'jest-dom/extend-expect'
import PhoneVerification from 'components/PhoneVerification'
import ApiClient from 'util/apiClient'
jest.mock('util/apiClient')

test('sends a request to the server to verify the phone number', () => {
  const {getByText, getByLabelText} = render(<PhoneVerification />)
  const input = getByLabelText('Phone number')
  const mockApiClient = ApiClient.mock.instances[0];
  const mockVerifyPhoneNumber = mockApiClient.verifyPhoneNumber

  fireEvent.change(input, { target: { value: '917-514-0136' } })
  fireEvent.click(getByText('Next'))

  expect(mockVerifyPhoneNumber).toHaveBeenCalledWith('917-514-0136')
})
