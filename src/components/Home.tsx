import React from 'react';
import { styles } from '@dreemhome/styles/Home.styles'
import { withStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import { Link } from "@reach/router"
import { RouteComponentProps } from '@reach/router';

interface Props extends RouteComponentProps{
  classes: any
}

interface State {
  section: 'welcome' | 'value_proposition'
}

class Home extends React.Component<Props, {}> {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <header data-testid='home-header' className="App-header">
          <h1>Welcome to Dreemhom</h1>
          <h2>Many newlyweds want to start their lives together in the home of their dreams.</h2>
        </header>
        <div>
          <h1>Why Dreemhøm?</h1>

          <h2>Your Registry Landing Page</h2>
          <p>It will be beautiful. So Beautiful. We designed it to be beautiful and simple to setup. Distribution.</p>

          <h2>More Payment Options</h2>
          <p>
            Your guests ll be able to use major credit cards,  debit cards, Apple Pay, Google Pay, Samsung Pay,
          ACH direct debit, and even Venmo!
          </p>

          <h2>The “Gift Letter”</h2>
          <h2>Fair Pricing</h2>
          <p>We charge a flat fee of $249 so you keep more of what you raise. Other crowdfunding sites will take thousands of dollars by charging 5% of your total raise.</p>
        </div>

        <Button color="primary" className={classes.button}>
          <Link to="/registration">Next</Link>
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
