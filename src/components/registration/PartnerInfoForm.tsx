import React, { FunctionComponent, useState, useEffect } from 'react'
import { PartnerInvite, PartnerInviteAttributes } from '@dreemhome/entities/PartnerInvite'
import { User } from '@dreemhome/entities/User'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import ApiClient from '@dreemhome/util/apiClient';

const apiClient = new ApiClient()

interface Props {
  partnerCreatedCallback: (partnerInvite: PartnerInvite) => void
  userId: string
}

const PartnerInfoForm: FunctionComponent<Props> = ({partnerCreatedCallback, userId}) => {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [
    partnerInviteAttributes,
    setPartnerInviteAttributes
  ] = useState<PartnerInviteAttributes>({
    first_name: '',
    last_name: '',
    email: ''
  })

  const handleChange = (field: string, value: string) => {
    const newPartnerInviteAttributes = Object.assign(
      {},
      partnerInviteAttributes,
      { [field]: value }
    )

    setPartnerInviteAttributes(newPartnerInviteAttributes)
  }

  useEffect(() => {
    if (submitted) {
      const createPartnerInvite = async () => {
        const result = await apiClient.createPartnerInvite(
          partnerInviteAttributes,
          userId
        ).catch((error) => {
        })

        if (result) {
          partnerCreatedCallback(result.data.data)
        }
      }
      createPartnerInvite()
    }
  }, [submitted])

  return (
    <div>
      <header>
        <h1>Tell us about your partner</h1>
      </header>
      <form data-testid="phone-verification" noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="first-name"
              label="First name"
              value={partnerInviteAttributes.first_name}
              onChange={(event) => handleChange('first_name', event.target.value) }
              fullWidth={true}
              margin="normal"
            />
            <TextField
              id="last-name"
              label="Last name"
              value={partnerInviteAttributes.last_name}
              onChange={(event) => handleChange('last_name', event.target.value) }
              fullWidth={true}
              margin="normal"
            />
            <TextField
              id="email-address"
              label="Email address"
              value={partnerInviteAttributes.email}
              onChange={(event) => handleChange('email', event.target.value) }
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

export default PartnerInfoForm
