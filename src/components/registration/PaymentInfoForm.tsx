import React, { FunctionComponent, useState, useEffect } from 'react'
import { CreditCardAttributes } from '@dreemhome/entities/CreditCard'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import ApiClient from '@dreemhome/util/apiClient'
import { Charge } from '@dreemhome/entities/Charge';

const apiClient = new ApiClient()

interface Props {
  weddingRegistryId: string
  callback: (charge: Charge) => void
}

const PaymentInfoForm: FunctionComponent<Props> = ({weddingRegistryId, callback}) => {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [creditCardAttributes, setCreditCardAttributes] = useState<CreditCardAttributes>({
    name: '',
    number: '',
    ccv: '',
    expiration_date: '',
    postal_code: '',
    wedding_registry_id: weddingRegistryId
  })

  const handleChange = (field: string, value: string) => {
    const newCreditCardAttributes = Object.assign({}, creditCardAttributes, { [field]: value })
    setCreditCardAttributes(newCreditCardAttributes)
  }

  useEffect(() => {
    if (submitted) {
      const createCharge = async () => {
        const result = await apiClient.createCharge(weddingRegistryId, creditCardAttributes)
        .catch((error) => {
        })
        if (result) {
          callback(result.data.data)
        }
      }
      createCharge()
    }
  }, [submitted])

  return (
    <div>
      <header>
        <h1>Pay your fee motherfucker</h1>
      </header>
      <form data-testid="phone-verification" noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="name"
              label="Name"
              value={creditCardAttributes.name}
              onChange={(event) => handleChange('name', event.target.value) }
              fullWidth={true}
              margin="normal"
            />
            <TextField
              id="number"
              label="Card number"
              value={creditCardAttributes.number}
              onChange={(event) => handleChange('number', event.target.value) }
              fullWidth={true}
              margin="normal"
            />
            <TextField
              id="ccv"
              label="CCV"
              value={creditCardAttributes.ccv}
              onChange={(event) => handleChange('ccv', event.target.value) }
              fullWidth={true}
              margin="normal"
            />
            <TextField
              id="expiration-date"
              label="Expiration date"
              value={creditCardAttributes.expiration_date}
              onChange={(event) => handleChange('expiration_date', event.target.value) }
              fullWidth={true}
              margin="normal"
            />
            <TextField
              id="potsal_code"
              label="Postal code"
              value={creditCardAttributes.postal_code}
              onChange={(event) => handleChange('postal_code', event.target.value) }
              fullWidth={true}
              margin="normal"
            />
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

export default PaymentInfoForm
