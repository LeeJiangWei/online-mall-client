import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Grid,
  Container,
  Segment,
  Image,
  Header,
  Item,
  Divider,
  Button,
  Icon,
  Statistic
} from 'semantic-ui-react';
import { setGlobalPortal } from '../../actions';
import { Link } from 'react-router-dom';

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
    const { userId, userName, address, phoneNumber } = this.state.user;
    return (
      <Segment>
        <Grid columns={2}>
          <Grid.Column width={8}>
            <Image
              src="https://react.semantic-ui.com/images/wireframe/square-image.png"
              size="small"
              rounded
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Header as="h1">{userName}</Header>
            <p>ID: {userId}</p>
            <p>Address: {address}</p>
            <p>Phone Number: {phoneNumber}</p>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }

  renderSellingGoods() {
    console.log(this.state);
    return (
      <Segment>
        <Header as="h2">Selling goods</Header>
        <Button as={Link} to="/goods/new">
          New
        </Button>
        <Divider />
        <Item.Group>
          {this.state.goods.map(
            ({ goodsName, goodsId, category, price, picture }) => {
              return (
                <Item key={goodsId}>
                  <Image size="tiny" src={picture} />
                  <Item.Content verticalAlign="middle">
                    <Grid>
                      <Grid.Column width={4}>
                        <Header size="huge" as="a">
                          {goodsName}
                        </Header>
                        <p>{category}</p>
                      </Grid.Column>
                      <Grid.Column width={5} verticalAlign="middle">
                        <Container text>
                          <Header as="h3">price: {price}</Header>
                        </Container>
                      </Grid.Column>
                      <Grid.Column width={7} verticalAlign="middle">
                        <Button>Edit</Button>
                        <Button>Unmount</Button>
                        <Button icon color="red">
                          <Icon name="trash" />
                        </Button>
                      </Grid.Column>
                    </Grid>
                  </Item.Content>
                </Item>
              );
            }
          )}
        </Item.Group>
      </Segment>
    );
  }

  renderStatistic() {
    return (
      <Segment>
        <Header as="h3">Statistic</Header>
        <Divider />
        <Container textAlign="center">
          <Statistic label="Your goods" value={this.state.goods.length} />
        </Container>
      </Segment>
    );
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
        <Grid>
          <Grid.Column width={6}>
            {this.renderUserCard()}
            {this.renderStatistic()}
          </Grid.Column>
          <Grid.Column width={10}>{this.renderSellingGoods()}</Grid.Column>
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
