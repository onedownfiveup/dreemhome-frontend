
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

const handleCloseCallback = jest.fn()

test('does not display the notification if closed', async () => {
  const message = 'You do not see me'
  const { queryByText } = render(<Notification handleCloseCallback={handleCloseCallback} open={true}>{message}</Notification>)

  expect(queryByText(message)).not.toBeNull()
})

test('toggles the notification message', async () => {
  const message = 'Now you see me, now you dont'
  const { queryByText, getByTestId, getByText } = render(<Notification handleCloseCallback={handleCloseCallback} open={true}>{message}</Notification>)

  expect(getByText(message)).toBeVisible()

  await fireEvent.click(getByTestId('notification-close-button'))

  console.log(queryByText(message).innerHTML)
  expect(getByText(message)).not.toBeVisible()
})

test('calls the handleClose callback when close button is pressed', () => {
  const message = "foo"

  const { getByTestId } = render(<Notification handleCloseCallback={handleCloseCallback} open={true}>{message}</Notification>)

  fireEvent.click(getByTestId('notification-close-button'))

  expect(handleCloseCallback).toHaveBeenCalled()
})
