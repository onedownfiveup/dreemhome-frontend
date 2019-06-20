import React, { FunctionComponent, useState, useEffect } from 'react'
import { CreditCardAttributes } from '@dreemhome/entities/CreditCard'
import Grid from '@material-ui/core/Grid'
import {CardElement, injectStripe} from 'react-stripe-elements'
import Button from '@material-ui/core/Button'
import ApiClient from '@dreemhome/util/apiClient';
import axios from 'axios'

const apiClient = new ApiClient()

interface Props {
  stripe?: any
}

const CreditCardInfoForm: FunctionComponent<Props> = ({stripe}) => {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [creditCardAttributes, setCreditCardAttributes] = useState<CreditCardAttributes>({
    name: '',
    number: '',
    ccv: '',
    expiration_date: '',
    postal_code: ''
  })

  const handleChange = (field: string, value: string) => {
    const newCreditCardAttributes = Object.assign({}, creditCardAttributes, { [field]: value })
    setCreditCardAttributes(newCreditCardAttributes)
  }

  useEffect(() => {
    if (submitted) {
      const submitStripeToken = async () => {
        let { token } = await stripe.createToken({ name: "Name" });
        debugger
        let response = await axios.post(
          "/charge",
          { body: token.id },
          { headers: { "Content-Type": "text/plain" } }
        ).catch(error => {
          // Handle stripe errors here
          console.log(error)
        })
        console.log(response)
      }
      submitStripeToken()
    }
  }, [submitted])


  return (
    <div>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CardElement />
          </Grid>
          <Grid>
            <Button
              color="primary"
              onClick={() => setSubmitted(true)}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  )
}

export default injectStripe(CreditCardInfoForm);
