import React, { FunctionComponent, useState, useEffect } from 'react'
import PhoneVerification from '@dreemhome/components/registration/PhoneVerification'
import { User } from '@dreemhome/entities/User'
import { RouteComponentProps } from '@reach/router'
import { PhoneNumber } from '@dreemhome/entities/PhoneNumber'
import UserInfoForm from '@dreemhome/components/registration/UserInfoForm'

interface Props extends RouteComponentProps{
}

type FormState = "unverified" | "verified" | "created" | "payment_created"

const RegistrationForm: FunctionComponent<Props> = () => {
  const [formState, setFormState] = useState<FormState>('unverified')
  const [user, setUser] = useState<User>({ attributes: { } })

  const handlePhoneNumberVerified = (phoneNumber: PhoneNumber) => {
    const newState = Object.assign(user, {
      user: {
        phone_number: phoneNumber
      }
    })

    setFormState('verified')
    setUser(newState)
  }

  useEffect(() => {
  }, [user, formState])

  return (
    <div>
      {(() => {
        switch (formState) {
          case 'unverified':
            return <PhoneVerification handleVerified={handlePhoneNumberVerified} />;
          case 'verified':
            return <UserInfoForm />
          default:
            return null;
        }
      })()}
    </div>
  )
}

export default RegistrationForm
