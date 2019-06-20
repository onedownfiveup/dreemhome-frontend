import axios, { AxiosResponse } from 'axios'
import { PhoneNumber } from 'entities/PhoneNumber'
import { User, UserAttributes } from '@dreemhome/entities/User';
import { PartnerInvite, PartnerInviteAttributes } from '@dreemhome/entities/PartnerInvite';
import { CreditCardAttributes } from '@dreemhome/entities/CreditCard';

class ApiClient {
  //baseUrl = "http://dreem-LoadB-1GLWRR53AM4WG-1884613302.us-east-1.elb.amazonaws.com"
  baseUrl = "http://localhost:8000"

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

  createUser(userAttributes: UserAttributes) {
    return axios.post(`${this.baseUrl}/users`, {
      data: {
        attributes: { ...userAttributes }
      }
    })
  }

  createPartnerInvite(partnerInvite: PartnerInviteAttributes, userId: string) {
    return axios.post(
        `${this.baseUrl}/users/${userId}/partner_invites`, {
          data: {
            attributes: { ...partnerInvite }
          }
        }
      )
  }

  createCharge(weddingRegistryId: string, creditCardAttributes: CreditCardAttributes) {
    return axios.post(
      `${this.baseUrl}/wedding_registries/${weddingRegistryId}/charge`, {
        data: {
          attributes: { ...creditCardAttributes }
        }
      }
    )
  }
}

export default ApiClient
