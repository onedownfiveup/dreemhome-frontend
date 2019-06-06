import React, {
  useState,
  FunctionComponent,
  useEffect
} from 'react'
import { styles } from './PhoneVerification.styles'
import { withStyles } from '@material-ui/styles'
import ApiClient from '@dreemhome/util/apiClient'
import { PhoneNumber } from '@dreemhome/entities/PhoneNumber'
import Notification from '@dreemhome/components/shared/Notification'
import GetPhoneVerificationForm from '@dreemhome/components/registration/GetPhoneVerificationForm'
import VerifyCodeForm from '@dreemhome/components/registration/VeriffyCodeForm'

interface Props {
  classes: any
  handleVerified: (phoneNumber: PhoneNumber) => void
}

const apiClient = new ApiClient()

const PhoneVerification: FunctionComponent<Props> = ({classes, handleVerified, children}) => {
  const [phoneNumber, setPhoneNumber] = useState<PhoneNumber>({
    id: '',
    attributes: {
      number: '',
      status: 'unverified'
    }
  })
  const [sentVerification, setSentVerification] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [hasError, setHasError] = useState<boolean>(false)
  const [number, setNumber] = useState<string>('')
  const [verificationCode, setVerificationCode] = useState('')

  const handleSubmitPhoneNumber = (number: string) => {
    setNumber(number)
  }

  const handleSubmitVerificationCode = (code: string, phoneNumberId?: string) => {
    setVerificationCode(code)
  }

  useEffect(() => {
    const verifyPhoneNumber = async () => {
      if (number.length > 0) {
        const result = await apiClient.verifyPhoneNumber(number).catch((error) => {
          setHasError(true)
          setErrorMessage("Phone verification failed, please try again")
          setNumber('')
        })

        if (result) {
          const phoneNumber = result.data.data as PhoneNumber
          const newPhoneNumber = Object.assign(phoneNumber)
          setPhoneNumber(newPhoneNumber)
          setSentVerification(true)
        }
      }
    }
    verifyPhoneNumber()
  }, [number])

  useEffect(() => {
    const verifyPhoneCode = async () => {
      if (phoneNumber.id && verificationCode.length > 0) {
        const result = await apiClient.verifyPhoneCode(
          phoneNumber.id,
          verificationCode
        ).catch((error) => {
          setHasError(true)
          setErrorMessage('Code verification failed, please try again')
          setVerificationCode('')
        })
        if (result) {
          handleVerified(result.data.data as PhoneNumber)
        }
      }
    }
    verifyPhoneCode()

  }, [verificationCode])

  const handleClose = () => {
    setHasError(false)
    setErrorMessage('')
  }

  return (
    <div>
      {hasError &&
        <Notification open={true} handleCloseCallback={handleClose}>{errorMessage}</Notification>
      }

      {!sentVerification ? (
        <GetPhoneVerificationForm classes={classes} handleSubmit={handleSubmitPhoneNumber} />
      ) : (
        <VerifyCodeForm classes={classes} handleSubmit={handleSubmitVerificationCode} phoneNumber={phoneNumber} />
      )}
    </div>
  )
}

export default withStyles(styles)(PhoneVerification)
