import axios from 'axios'
import ApiClient from 'util/apiClient'
import MockAdapter from 'axios-mock-adapter'

const axiosMock = new MockAdapter(axios);

test('verify phone number makes appropriate API call', (done) => {
  const apiClient = new ApiClient()
  const phoneNumber = '222-232-2232'

  apiClient.verifyPhoneNumber(phoneNumber).then(() => {
    expect(axiosMock.history.get.length).toBe(1)
    expect(axiosMock.history.get[0].url)
    .toBe(`http://localhost:8000/phone_numbers/verify?phone_number=${phoneNumber}`)
  })
  .then(done)
  .catch(done.fail);
})
