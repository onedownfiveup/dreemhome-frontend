import React from 'react'
import {render, fireEvent, cleanup, getByTestId} from 'react-testing-library'
import 'jest-dom/extend-expect'
import LoginForm from 'components/LoginForm'

test('renders the login form', () => {
  const {getByText} = render(<LoginForm />)
})
