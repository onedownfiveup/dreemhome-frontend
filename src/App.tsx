import React from 'react';
import Container from '@material-ui/core/Container'
import { withStyles } from '@material-ui/styles'
import { Router } from "@reach/router"
import { styles } from 'styles/App.styles'
import Home from '@dreemhome/components/Home'
import RegistrationForm from '@dreemhome/components/registration/RegistrationForm'

type Props = Partial<{classes: any}>

class App extends React.Component<Props, object> {
  render() {
    const { classes } = this.props;

    return (
      <Container maxWidth="sm" className={classes.root}>
        <Router>
          <Home path="/" />
          <RegistrationForm path="/registration" />
        </Router>
        {this.props.children}
      </Container>
    );
  }
}

export default withStyles(styles)(App);
