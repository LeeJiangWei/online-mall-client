import React from 'react';

class Register extends React.Component {
  componentDidMount() {
    this.props.history.push('/');
  }

  render() {
    return <h1>Register page</h1>;
  }
}

export default Register;
