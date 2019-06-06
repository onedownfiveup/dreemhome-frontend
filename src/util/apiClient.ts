import axios, { AxiosResponse } from 'axios'
import { PhoneNumber } from 'entities/PhoneNumber'
import { User } from '@dreemhome/entities/User';

class ApiClient {
  baseUrl = "http://dreem-LoadB-1GLWRR53AM4WG-1884613302.us-east-1.elb.amazonaws.com"
  //baseUrl = "http://localhost:8000"

  constructor() {
    axios.defaults.withCredentials = true
  }

  verifyPhoneNumber(phoneNumber: string) {
    return axios
      .get(`${this.baseUrl}/phone_numbers/verify?phone_number=${phoneNumber}`)
  }

  verifyPhoneCode(phoneNumberId: string, code: string) {
    return axios
      .post(
        `${this.baseUrl}/phone_numbers/verify/${phoneNumberId}`,
        { code: code }
      )
  }

  createUser(user: User) {
    return axios
      .post(
        `${this.baseUrl}/users`,
        { data: {...user} }
      )
  }
}

export default ApiClient
