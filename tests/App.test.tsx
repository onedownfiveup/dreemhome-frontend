import React from 'react'
import {render, fireEvent, cleanup, getByTestId} from 'react-testing-library'
import 'jest-dom/extend-expect'
import App from 'App'

afterEach(cleanup)

test('displays the header title', () => {
  const {getByText} = render(<App />)

  const header = getByText('Welcome to Dreemhom')
  expect(header).toHaveTextContent('Dreemhom')
})
