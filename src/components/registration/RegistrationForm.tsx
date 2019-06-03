import React, { FormEvent } from 'react'
import PhoneVerification from '@dreemhome/components/registration/PhoneVerification'
import { User } from '@dreemhome/entities/User'
import { RouteComponentProps } from '@reach/router';

interface Props extends RouteComponentProps{
}

interface State {
  user: User
  userState: "unverified" | "verified" | "created" | "payment_created"
}

class RegistrationForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      userState: 'unverified',
      user: {
        firstName: '',
        lastName: '',
        phoneNumber: {
          number: '',
          verified: false
        }
      }
    }
  }

  handleUserChanged = (user: User) => {
    console.log("foodyshnickens")
  }

  render() {
    return (
      <div>
        {(() => {
          switch (this.state.userState) {
            case 'unverified':
              return <PhoneVerification handleUserChanged={this.handleUserChanged} />;
            default:
              return null;
          }
        })()}
      </div>
    )
  }
}

export default RegistrationForm
