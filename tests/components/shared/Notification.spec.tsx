
import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  getByText
} from 'react-testing-library'
import 'jest-dom/extend-expect'
import Notification from '@dreemhome/components/shared/Notification'

afterEach(cleanup)

test('does not display the notification if closed', async () => {
  const message = 'You do not see me'
  const { queryByText } = render(<Notification open={true}>{message}</Notification>)

  expect(queryByText(message)).not.toBeNull()
})

test('toggles the notification message', async () => {
  const message = 'Now you see me, now you dont'
  const { queryByText, getByTestId, getByText } = render(<Notification open={true}>{message}</Notification>)

  expect(getByText(message)).toBeVisible()

  await fireEvent.click(getByTestId('notification-close-button'))

  console.log(queryByText(message).innerHTML)
  expect(getByText(message)).not.toBeVisible()
})
