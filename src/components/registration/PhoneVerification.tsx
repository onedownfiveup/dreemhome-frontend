import React, {
  useState,
  FunctionComponent,
  useEffect,
  useLayoutEffect
} from 'react'
import { styles } from './PhoneVerification.styles'
import { withStyles } from '@material-ui/styles'
import ApiClient from '@dreemhome/util/apiClient'
import { User } from '@dreemhome/entities/User'
import { PhoneNumber } from '@dreemhome/entities/PhoneNumber'
import Notification from '@dreemhome/components/shared/Notification'
import GetPhoneVerificationForm from '@dreemhome/components/registration/GetPhoneVerificationForm'
import VerifyCodeForm from '@dreemhome/components/registration/VeriffyCodeForm'

interface Props {
  classes: any
  handleUserChanged: (user: User) => void
}

const apiClient = new ApiClient()

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
