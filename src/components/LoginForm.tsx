import React, { FormEvent } from 'react'
import { string } from 'prop-types';
import axios from 'axios'


interface FormState {
  username: string,
  password: string,
  [key: string]: FormState[keyof FormState];
}

const initialState: FormState = {
  username: '',
  password: ''
}

type State = typeof initialState
type Props = Partial<{}>

class LoginForm extends React.Component<Props, State> {
  readonly state: State = initialState

  constructor(props: Props) {
    super(props);
    this.state = {username: '', password: ''};
  }

  handleChange = (event: FormEvent, field: string) => {
    const target = event.target as HTMLInputElement
    const newState = Object.assign({}, this.state)

    newState[field] = target.value
    this.setState(newState as State);
  }

  handleSubmit = (event: FormEvent) => {
    axios.defaults.withCredentials = true
    axios.post('http://localhost:8000/users/login', {
      username: this.state.username,
      password: this.state.password
    })
    alert('A name was submitted: ' + this.state.username + " Password " + this.state.password);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          User Name:
          <input type="text" value={this.state.username} onChange={(event) => this.handleChange(event, 'username')} />
        </label>
        <label>
          Password:
          <input type="text" value={this.state.password} onChange={(event) => this.handleChange(event, 'password')} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default LoginForm
