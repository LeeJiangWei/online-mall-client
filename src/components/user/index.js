import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class User extends React.Component {
  state = { status: 2, user: {}, goods: [] };

  async componentDidMount() {
    try {
      const res = await axios.get(
        `/api/user/${this.props.match.params.userId}`
      );
      const { message, user, goods } = res.data;
      if (message === 'success') {
        this.setState({ user, goods });
      }
    } catch (e) {
      console.log(e);
    }
  }

  static getDerivedStateFromProps(props) {
    return { status: props.status };
  }

  render() {
    if (this.state.status === 0) {
      window.alert('You are not able to access this page unless you sign in.');
      this.props.history.push('/login');
      return null;
    }
    // Get params in url
    return <h1>User page for user Id: {this.props.match.params.userId}</h1>;
  }
}

const mapStateToProps = state => {
  return state;
};

export default connect(
  mapStateToProps,
  {}
)(User);
