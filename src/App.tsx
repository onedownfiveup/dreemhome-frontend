import React from 'react';
import Container from '@material-ui/core/Container'
import { withStyles } from '@material-ui/styles'
import { Router, Link } from "@reach/router"
import { styles } from 'styles/App.styles'
import Home from '@dreemhome/components/Home'
import RegistrationForm from '@dreemhome/components/registration/RegistrationForm'

type Props = Partial<{classes: any}>

class App extends React.Component<Props, object> {
  render() {
    const { classes } = this.props;

    return (
      <Container maxWidth="sm" className={classes.root}>
        <header data-testid='home-header' className="App-header">
          <h1>Welcome to Dreemhom</h1>
          <h2>Many newlyweds want to start their lives together in the home of their dreams.</h2>
        </header>

        <PhoneVerification />
      </Container>
    );
  }
}

export default withStyles(styles)(App);
