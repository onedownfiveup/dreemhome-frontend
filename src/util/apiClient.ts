import axios from 'axios'
import { basename } from 'path';

class ApiClient {
  baseUrl = ""

  constructor() {

    axios.defaults.withCredentials = true
  }

  verifyPhoneNumber(phoneNumber: string) {
    axios.defaults.withCredentials = true
    return axios
    .get(`${this.baseUrl}/phone_numbers/verify?phone_number=${phoneNumber}`)
    .then((response) => {})
    .catch((error) => {});
  }
}

export default ApiClient
