import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from 'semantic-ui-react';

import { login } from '../../utils/api';

class Login extends React.Component {
  state = { username: '', password: '' };

  componentDidMount() {}

  onUsernameChange = e => {
    this.setState({ username: e.target.value });
  };

  onPasswordChange = e => {
    this.setState({ password: e.target.value });
  };

  onSubmit = async e => {
    const res = await login(this.state.username, this.state.password);
    const { message, userState } = res;
    if (message === 'success') {
      this.props.setAppState({ isLogin: true, userState: userState });
      this.props.history.goBack();
    }
  };

  render() {
    return (
      <Grid
        textAlign="center"
        style={{ height: '80vh' }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            Log-in to your account
          </Header>
          <Form size="large">
            <Segment>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                value={this.state.username}
                onChange={this.onUsernameChange}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                value={this.state.password}
                onChange={this.onPasswordChange}
              />
              <Button color="teal" fluid size="large" onClick={this.onSubmit}>
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us? <Link to="/register">Sign Up</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
