import React from 'react';

class User extends React.Component {
  render() {
    // Get params in url
    return <h1>User page for user Id: {this.props.match.params.userId}</h1>;
  }
}

export default User;
