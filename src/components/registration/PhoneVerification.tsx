import React, {
  useState,
  FunctionComponent
} from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { styles } from './PhoneVerification.styles'
import { withStyles } from '@material-ui/styles'
import ApiClient from '@dreemhome/util/apiClient'
import { User } from '@dreemhome/entities/User'

interface Props {
  classes: any
  handleUserChanged: (user: User) => void
}

interface GetPhoneVerificationFormProps {
  classes: any
  handleSubmit: (phoneNumber: string) => void
}

interface VerifyCodeFormProps {
  classes: any
  handleSubmit: (code: string, phoneNumberId?: string) => void
  user: User
}

const apiClient = new ApiClient()

const GetPhoneVerificationForm: FunctionComponent<GetPhoneVerificationFormProps> = ({
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
      <p>
        Please enter your mobile number or contact email and well send you a confirmation code to make
sure you are not a creepy bot:
        </p>
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

const PhoneVerification: FunctionComponent<Props> = ({classes, handleUserChanged, children}) => {
  const [sentVerification, setSentVerification] = useState(false)
  const [user, setUser] = useState<User>({
    firstName: '',
    lastName: '',
    phoneNumber: {
      id: '',
      number: '',
      verified: false
    }
  })

  const handleSubmitPhoneNumber = (number: string) => {
    handleUserChanged(user)
    apiClient.verifyPhoneNumber(number, (phoneNumber) => {
      const newUser = Object.assign(user, {phoneNumber: phoneNumber})
      setUser(newUser)
      setSentVerification(true)
    }).catch(error => {})
  }

  const handleSubmitVerificationCode = (code: string, phoneNumberId?: string) => {
    if (phoneNumberId) {
      handleUserChanged(user)
      apiClient.verifyPhoneCode(phoneNumberId, code, (phoneNumber) => {
        const newUser = Object.assign(user, { phoneNumber: phoneNumber })
        setUser(newUser)
      }).catch(error => { })
    }
  }

  if (!sentVerification) {
    return(
      <GetPhoneVerificationForm classes={classes} handleSubmit={handleSubmitPhoneNumber} />
    )
  } else {
    return(
      <VerifyCodeForm classes={classes} handleSubmit={handleSubmitVerificationCode} user={user} />
    )
  }
}

export default withStyles(styles)(PhoneVerification)
