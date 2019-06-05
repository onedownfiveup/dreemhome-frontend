import React, {
  useState,
  FunctionComponent
} from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

interface GetPhoneVerificationFormProps {
  classes: any
  handleSubmit: (phoneNumber: string) => void
}

export const GetPhoneVerificationForm: FunctionComponent<GetPhoneVerificationFormProps> = ({
  classes,
  handleSubmit,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(event.target.value)
  }

  return (
    <div>
      <h1>Are You Real?</h1>
      <p>Please enter your mobile number or contact email and well send you a confirmation code to make sure you are not a creepy bot:</p>
      <form data-testid="phone-verification" className={classes.container} noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="phone-number"
              label="Phone number"
              className={classes.textField}
              value={phoneNumber}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid>
            <Button
              color="primary"
              className={classes.button}
              onClick={() => handleSubmit(phoneNumber)}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </div >
  )
}

export default GetPhoneVerificationForm
