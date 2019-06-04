import React, {
  useState,
  FunctionComponent,
  useEffect,
  useLayoutEffect
} from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { styles } from './PhoneVerification.styles'
import { withStyles } from '@material-ui/styles'
import ApiClient from '@dreemhome/util/apiClient'
import { User } from '@dreemhome/entities/User'
import { PhoneNumber } from '@dreemhome/entities/PhoneNumber'
import Notification from '@dreemhome/components/shared/Notification'
import axios from 'axios'

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
  const [user, setUser] = useState<User>({
    firstName: '',
    lastName: '',
    phoneNumber: {
      id: '',
      number: '',
      verified: false
    }
  })
  const [sentVerification, setSentVerification] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)
  const [number, setNumber] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState('')

  const handleSubmitPhoneNumber = (number: string) => {
    handleUserChanged(user)
    setNumber(number)
  }

  const handleSubmitVerificationCode = (code: string, phoneNumberId?: string) => {
    setVerificationCode(code)
    handleUserChanged(user)
  }

  useLayoutEffect(() => {
    const verifyPhoneNumber = async () => {
      if (number.length > 0) {
        const result = await apiClient.verifyPhoneNumber(number).catch((error) => {
          setHasError(true)
          setErrorMessage("Phone verification failed, please try again")
        })

        if (result) {
          const phoneNumber = result.data['data']['attributes'] as PhoneNumber
          phoneNumber.id = result.data['data']['id']

          const newUser = Object.assign(user, { phoneNumber: phoneNumber })
          setUser(newUser)
          setSentVerification(true)
        }
      }
    }
    verifyPhoneNumber()
  }, [number])

  useEffect(() => {
    const verifyPhoneCode = async () => {
      if (user.phoneNumber.id) {
        const result = await apiClient.verifyPhoneCode(
          user.phoneNumber.id,
          verificationCode
        ).catch((error) => {
          setHasError(true)
          setErrorMessage('Code verification failed, please try again')
        })
      }
    }
    verifyPhoneCode()

  }, [verificationCode])

  return (
    <div>
      {hasError &&
        <Notification open={true}>{errorMessage}</Notification>
      }

      {!sentVerification ? (
        <GetPhoneVerificationForm classes={classes} handleSubmit={handleSubmitPhoneNumber} />
      ) : (
        <VerifyCodeForm classes={classes} handleSubmit={handleSubmitVerificationCode} user={user} />
      )}
    </div>
  )
}

export default withStyles(styles)(PhoneVerification)
