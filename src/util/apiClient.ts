import axios, { AxiosResponse } from 'axios'
import { basename } from 'path'
import { PhoneNumber } from 'entities/PhoneNumber'

class ApiClient {
  //baseUrl = "http://dreem-LoadB-1GLWRR53AM4WG-1884613302.us-east-1.elb.amazonaws.com"
  baseUrl = "http://localhost:8000"

  constructor() {
    axios.defaults.withCredentials = true
  }

  verifyPhoneNumber(phoneNumber: string, callBack: (phoneNumber: PhoneNumber) => void) {
    return axios
      .get(`${this.baseUrl}/phone_numbers/verify?phone_number=${phoneNumber}`)
      .then((response: AxiosResponse) => {
        const phoneNumber = response.data['data']['attributes'] as PhoneNumber
        phoneNumber.id = response.data['data']['id']
        callBack(phoneNumber)
      })
  }

  verifyPhoneCode(phoneNumberId: string, code: string, callBack: (phoneNumber: PhoneNumber) => void) {
    return axios
      .post(
        `${this.baseUrl}/phone_numbers/verify/${phoneNumberId}`,
        { code: code }
      ).then((response: AxiosResponse) => {
        const phoneNumber = response.data['data']['attributes'] as PhoneNumber
        phoneNumber.id = response.data['data']['id']
        callBack(phoneNumber)
      })
  }
}

export default ApiClient
