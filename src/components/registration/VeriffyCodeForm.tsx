import React, {
  useState,
  FunctionComponent
} from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { User } from '@dreemhome/entities/User'

interface VerifyCodeFormProps {
  classes: any
  handleSubmit: (code: string, phoneNumberId?: string) => void
  user: User
}

const VerifyCodeForm: FunctionComponent<VerifyCodeFormProps> = ({
  classes,
  handleSubmit,
  user
}) => {
  const [verificationCode, setVerificationCode] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(event.target.value)
  }

  return (
    <div>
      <h1>Confirmation Time</h1>
      <p>
        Please enter your the 4 digit confirmation code we sent to you via email or SMS:
      </p>
      <form data-testid="phone-verification" className={classes.container} noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="verification-code"
              label="Verification code"
              className={classes.textField}
              value={verificationCode}
              onChange={handleChange}
              margin="normal"
            />
          </Grid>
          <Grid>
            <Button
              color="primary"
              className={classes.button}
              onClick={() => handleSubmit(verificationCode, user.phoneNumber.id)}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
    </div >
  )
}

export default VerifyCodeForm
