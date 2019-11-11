import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Grid, Container, Segment, Image, Header } from 'semantic-ui-react';
import { setGlobalPortal } from '../../actions';

class User extends React.Component {
  state = { status: 2, user: {}, goods: [] };

  async componentDidMount() {
    try {
      const res = await axios.get(
        `/api/user/${this.props.match.params.userId}`
      );
      const { message, user, goods } = res.data;
      if (message === 'success') {
        if (user) {
          this.setState({ user, goods });
        } else {
          console.log('User not found');
        }
      }
    } catch (e) {
      this.props.setGlobalPortal(true, 'negative', 'Network error', e);
    }
  }

  static getDerivedStateFromProps({ status }) {
    return { status };
  }

  renderUserCard() {
    const { userId, userName, address, phoneNumber } = this.props.user;
    return (
      <Segment>
        <Grid>
          <Grid.Column width={6}>
            <Image
              src="https://react.semantic-ui.com/images/wireframe/square-image.png"
              size="medium"
              rounded
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Header as="h1">{userName}</Header>
            <Header as="h3">{userId}</Header>
            <Header as="h3">{address}</Header>
            <Header as="h3">{phoneNumber}</Header>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }

  renderSellingGoods() {
    return <Segment>Selling</Segment>;
  }

  renderStatistic() {
    return <Segment>Statistic</Segment>;
  }

  render() {
    if (this.state.status === 0) {
      //window.alert('You are not able to access this page unless you sign in.');
      this.props.setGlobalPortal(
        true,
        'negative',
        'Access denied',
        'You are not able to access this page unless you sign in.'
      );
      this.props.history.push('/login');
      return null;
    }
    // Get params in url
    return (
      <Container>
        {this.renderUserCard()}
        <Grid>
          <Grid.Column width={10}>{this.renderSellingGoods()}</Grid.Column>
          <Grid.Column width={6}>{this.renderStatistic()}</Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

export default connect(
  mapStateToProps,
  { setGlobalPortal }
)(User);
