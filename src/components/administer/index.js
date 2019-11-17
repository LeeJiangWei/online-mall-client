import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  Container,
  Grid,
  Header,
  Icon,
  Segment,
  Menu,
  Input,
  Item,
  Image,
  Button
} from 'semantic-ui-react';
import { setGlobalPortal } from '../../actions';
import { Link } from 'react-router-dom';

class Administer extends React.Component {
  state = { activeItem: 'Goods', userId: -1, users: [], goods: [], orders: [] };

  async componentDidMount() {
    const { userId } = this.state;
    let access = true; // access control flag

    if (userId !== -1) {
      // not login
      try {
        const res = await axios.get(`/api/user/${userId}`);
        const { message, user } = res.data;
        if (message === 'success') {
          if (user.userState >= 5) {
            // check if user is admin
            access = true;
          }
        }
      } catch (e) {
        this.props.setGlobalPortal(true, 'negative', 'Network error', e);
      }
    }
    if (!access) {
      // access deny, go to login page
      this.props.setGlobalPortal(
        true,
        'negative',
        'Access denied',
        'You are not able to access this page unless you sign in.'
      );
      this.props.history.push('/login');
    } else {
      // access permit, fetch data
      await this.fetchData();
    }
  }

  static getDerivedStateFromProps(props) {
    return {
      userId: props.userId
    };
  }

  async fetchData() {
    try {
      const response_of_goods = await axios.get('/api/goods/');
      if (response_of_goods.data.message === 'success') {
        this.setState({ goods: response_of_goods.data.goods });
      }

      const response_of_orders = await axios.get('/api/order/');
      if (response_of_orders.data.message === 'success') {
        this.setState({ orders: response_of_orders.data.orders });
      }

      const response_of_users = await axios.get('/api/user/');
      if (response_of_goods.data.message === 'success') {
        this.setState({ users: response_of_users.data.users });
      }
    } catch (e) {
      this.props.setGlobalPortal(
        true,
        'negative',
        'Network Error',
        e.toString()
      );
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  renderWelcomeSegment() {
    return (
      <Header size="huge" floated="left">
        <Icon name="user" />
        <Header.Content>
          Hello, {this.props.userName}, Dear System Administrator
        </Header.Content>
      </Header>
    );
  }

  renderSelector() {
    const { activeItem } = this.state;
    const items = ['Goods', 'Orders', 'Users'];

    return (
      <Menu secondary>
        {items.map(item => {
          return (
            <Menu.Item
              key={item}
              name={item}
              active={activeItem === item}
              onClick={this.handleItemClick}
            />
          );
        })}
        <Menu.Menu position="right">
          <Menu.Item>
            <Input icon="search" placeholder="Search..." />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }

  renderGoodsList() {
    const stateToText = {
      0: 'Frozen',
      1: 'On sale',
      2: 'Sold out'
    };
    return (
      <Item.Group>
        {this.state.goods.map(good => {
          const {
            goodsName,
            goodsId,
            category,
            price,
            picture,
            goodsState
          } = good;
          return (
            <Item key={goodsId}>
              <Image size="tiny" src={picture} />
              <Item.Content verticalAlign="middle">
                <Grid>
                  <Grid.Column width={4}>
                    <Header size="huge" as={Link} to={`/goods/${goodsId}`}>
                      {goodsName}
                    </Header>
                    <p>{category}</p>
                  </Grid.Column>
                  <Grid.Column width={4} verticalAlign="middle">
                    <Container text>
                      <Header as="h3">￥{price}</Header>
                    </Container>
                  </Grid.Column>
                  <Grid.Column width={4} verticalAlign="middle">
                    <Container text>{stateToText[goodsState]}</Container>
                  </Grid.Column>
                  <Grid.Column
                    width={4}
                    verticalAlign="middle"
                    textAlign="right"
                  >
                    <Button
                      animated="fade"
                      as={Link}
                      to={`/goods/edit/${goodsId}`}
                    >
                      <Button.Content hidden>Edit</Button.Content>
                      <Button.Content visible>
                        <Icon name="edit" />
                      </Button.Content>
                    </Button>
                    <Button
                      animated="fade"
                      color="red"
                      onClick={() => this.onUnmountButtonClick(good)}
                    >
                      <Button.Content hidden>Unmount</Button.Content>
                      <Button.Content visible>
                        <Icon name="close" />
                      </Button.Content>
                    </Button>
                  </Grid.Column>
                </Grid>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    );
  }

  renderOrdersList() {}

  renderUsersList() {
    const stateToText = {
      0: 'Frozen',
      1: 'Normal User',
      5: 'Super Admin'
    };
    return (
      <Item.Group>
        {this.state.users.map(user => {
          console.log(user);
          const {
            userId,
            userName,
            address,
            phoneNumber,
            password,
            userState
          } = user;
          return (
            <Item key={userId}>
              <Item.Content>
                <Grid>
                  <Grid.Column>
                    <Header as="h2">{userName}</Header>
                    ID: {userId}
                  </Grid.Column>
                </Grid>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    );
  }

  renderList() {
    switch (this.state.activeItem) {
      case 'Goods':
        return this.renderGoodsList();
      case 'Orders':
        return this.renderOrdersList();
      case 'Users':
        return this.renderUsersList();
      default:
        return this.renderGoodsList();
    }
  }

  render() {
    return (
      <>
        <Segment clearing vertical>
          {this.renderWelcomeSegment()}
        </Segment>
        {this.renderSelector()}
        <Segment clearing vertical>
          {this.renderList()}
        </Segment>
      </>
    );
  }
}

const mapStateToProps = state => {
  return state.user;
};

export default connect(
  mapStateToProps,
  { setGlobalPortal }
)(Administer);
