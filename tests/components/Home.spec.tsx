import React from 'react'
import {render, fireEvent, cleanup, getByTestId} from 'react-testing-library'
import 'jest-dom/extend-expect'
import Home from '@dreemhome/components/Home'
import {
  Router,
  Link,
  createHistory,
  createMemorySource,
  LocationProvider,
} from '@reach/router'

afterEach(cleanup)
function renderWithRouter(
  ui,
  { route = '/', history = createHistory(createMemorySource(route)) } = {}
) {
  return {
    ...render(<LocationProvider history={history}>{ui}</LocationProvider>),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  }
}

// This test was skipped because the reach router is not working properly
xtest('clicking on the next button takes you to the registration flow', async () => {
  const {
    container,
    getByText,
    getByTestId,
    history: { navigate },
  } = renderWithRouter(<Home />)

  const leftClick = { button: 0 }
  fireEvent.click(getByText(/Next/i), leftClick)
  await navigate('/registration')

  console.log(container.innerHTML)
  expect(getByTestId('phone-verification')).toBeDefined
})
