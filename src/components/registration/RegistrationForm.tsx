import React, { FunctionComponent, useState, useEffect } from 'react'
import PhoneVerification from '@dreemhome/components/registration/PhoneVerification'
import { User } from '@dreemhome/entities/User'
import { RouteComponentProps } from '@reach/router'
import { PhoneNumber } from '@dreemhome/entities/PhoneNumber'
import PaymentInfoForm from '@dreemhome/components/registration/PaymentInfoForm'
import UserInfoForm from '@dreemhome/components/registration/UserInfoForm'
import PartnerInfoForm from '@dreemhome/components/registration/PartnerInfoForm'
import { PartnerInvite } from '@dreemhome/entities/PartnerInvite';
import { Charge } from '@dreemhome/entities/Charge';

type FormState = "unverified" | "verified" | "created" | "partner_invited" | "payment_created"

const RegistrationForm: FunctionComponent<RouteComponentProps> = () => {
  const [formState, setFormState] = useState<FormState>('unverified')
  const [user, setUser] = useState<User>({
    id: '',
    attributes: { }
  })
  const [partnerInvte, setPartnerInvite] = useState<PartnerInvite>({
    id: '',
    attributes: { }
  })
  const [charge, setCharge] = useState<Charge>({
    id: '',
    attributes: {}
  })

  const handlePhoneNumberVerified = (phoneNumber: PhoneNumber) => {
    setFormState('verified')
  }

  const handleUserCreated = (user: User) => {
    setUser(user)
    setFormState('created')
  }

  const handlePartnerCreated = (partnerInvite: PartnerInvite) => {
    setPartnerInvite(partnerInvite)
    setFormState('partner_invited')
  }

  const handleChargeCreated = (charge: Charge) => {
    setCharge(charge)
    setFormState('payment_created')
  }

  return (
    <div>
      {(() => {
        switch (formState) {
          case 'unverified':
            return <PhoneVerification handleVerified={handlePhoneNumberVerified} />;
          case 'verified':
            return <UserInfoForm userCreatedCallback={handleUserCreated}/>
          case 'created':
            return <PartnerInfoForm partnerCreatedCallback={handlePartnerCreated} userId={user.id} />
          case 'partner_invited':
            if (partnerInvte.attributes.wedding_registry_id) {
              return <PaymentInfoForm callback={handleChargeCreated} weddingRegistryId={partnerInvte.attributes.wedding_registry_id} />
            }
          default:
            return null;
        }
      })()}
    </div>
  )
}

export default RegistrationForm
