import React, { FunctionComponent, useState, useEffect } from 'react'
import { User } from '@dreemhome/entities/User'
import { RouteComponentProps } from '@reach/router';
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import ApiClient from '@dreemhome/util/apiClient';

const apiClient = new ApiClient()

interface Props {
  userCreatedCallback: (user: User) => void
}

const UserInfoForm: FunctionComponent<Props> = ({userCreatedCallback}) => {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [user, setUser] = useState<User>({
    attributes: {
      first_name: '',
      last_name: '',
      postal_code: '',
      email: ''
    }
  })

  const handleChange = (field: string, value: string) => {
    const newUser = Object.assign(user, {
      attributes: {
        ...user.attributes,
        [field]: value
      }
    })

    setUser(newUser)
  }

  useEffect(() => {
    const createUser = async () => {
      const result = await apiClient.createUser(user).catch((error) => {
      })

      if (result) {
        userCreatedCallback(result.data.data)
      }
    }

    createUser()
  }, [submitted])

  return (
    <div>
      <header>
        <h1>Tell us about yourself</h1>
      </header>
      <form data-testid="phone-verification" noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="first-name"
              label="First name"
              value={user.attributes.first_name}
              onChange={(event) => handleChange('first_name', event.target.value) }
              fullWidth={true}
              margin="normal"
            />
            <TextField
              id="last-name"
              label="Last name"
              value={user.attributes.last_name}
              onChange={(event) => handleChange('last_name', event.target.value) }
              fullWidth={true}
              margin="normal"
            />
            <TextField
              id="postal-code"
              label="Postal code"
              value={user.attributes.postal_code}
              onChange={(event) => handleChange('postal_code', event.target.value) }
              fullWidth={true}
              margin="normal"
            />
            <TextField
              id="email-address"
              label="Email address"
              value={user.attributes.email}
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

export default UserInfoForm
