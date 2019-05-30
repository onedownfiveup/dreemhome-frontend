import React, { FormEvent } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import { styles } from './PhoneVerification.styles'
import { withStyles } from '@material-ui/styles';
import ApiClient from '../util/apiClient';

interface FormState {
  phoneNumber: string
}

type Props = Partial<{classes: any}>

class PhoneVerification extends React.Component<Props, FormState> {
  apiClient = new ApiClient()

  constructor(props: Props) {
    super(props)
    this.state = {phoneNumber: ''}
  }

  handleChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({phoneNumber: event.target.value });
  }

  handleSubmit = () => {
    this.apiClient.verifyPhoneNumber(this.state.phoneNumber)
  }

  render() {
    const classes = this.props.classes

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              id="phone-number"
              label="Phone number"
              className={classes.textField}
              value={this.state.phoneNumber}
              onChange={this.handleChange()}
              margin="normal"
            />
          </Grid>
          <Grid>
            <Button color="primary" className={classes.button} onClick={this.handleSubmit}>
              Next
            </Button>
          </Grid>
        </Grid>
      </form>
    )
  }
}

export default  withStyles(styles)(PhoneVerification)
