import React from 'react';
import axios from 'axios';
import _ from 'lodash';
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
  Button,
  Table,
  Dropdown
} from 'semantic-ui-react';
import { setGlobalPortal } from '../../actions';
import { Link } from 'react-router-dom';

import EditUser from './EditUser';
import CreateUser from './CreateUser';
import EditOrder from './EditOrder';
import BlankSegment from './BlankSegment';
import DeleteModal from './DeleteModal';

class Administer extends React.Component {
  state = {
    activeItem: 'Users',
    userId: -1,
    users: [],
    goods: [],
    orders: [],
    loading: false,
    direction: null,
    column: null,
    searchOption: -1,
    keyword: ''
  };

  async componentDidMount() {
    const { userId } = this.state;
    let access = true; // access control flag

    if (userId !== -1) {
      // not login
      try {
        this.setState({ loading: true });

        const res = await axios.get(`/api/user/${userId}`);
        const { message, user } = res.data;
        if (message === 'success') {
          if (user.userState >= 5) {
            // check if user is admin
            access = true;
          }
        }

        this.setState({ loading: false });
      } catch (e) {
        this.props.setGlobalPortal(
          true,
          'negative',
          'Network error',
          e.toString()
        );
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
      this.setState({ loading: true });

      const response_of_goods = await axios.get('/api/goods/');
      if (response_of_goods.data.message === 'success') {
        this.setState({ goods: response_of_goods.data.goods });
      }

      const response_of_orders = await axios.get('/api/order/all');
      if (response_of_orders.data.message === 'success') {
        this.setState({ orders: response_of_orders.data.orders });
      }

      const response_of_users = await axios.get('/api/user/');
      if (response_of_goods.data.message === 'success') {
        this.setState({ users: response_of_users.data.users });
      }

      this.setState({ loading: false });
    } catch (e) {
      this.props.setGlobalPortal(
        true,
        'negative',
        'Network Error',
        e.toString()
      );
    }
  }

  handleItemClick = (e, { name }) =>
    this.setState({ activeItem: name, searchOption: -1 });

  onActionButtonClick = async (good, nextState) => {
    try {
      const response = await axios.post(`/api/goods/${good.goodsId}`, {
        ...good,
        goodsState: nextState
      });
      const { message } = response.data;
      if (message === 'success') {
        await this.fetchData();
        this.props.setGlobalPortal(
          true,
          'info',
          'Success',
          `Successfully ${nextState ? 'mount' : 'unmount'} your goods`
        );
      } else {
        this.props.setGlobalPortal(true, 'negative', 'Failure', message);
      }
    } catch (e) {
      this.props.setGlobalPortal(
        true,
        'negative',
        'Network Error',
        e.toString()
      );
    }
  };

  handleSort = (clickedColumn, dataName) => {
    const { column, direction } = this.state;
    const data = this.state[dataName];

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        [dataName]: _.sortBy(data, [clickedColumn]),
        direction: 'ascending'
      });

      return;
    }

    this.setState({
      [dataName]: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending'
    });
  };

  onSearchOptionChange = (e, { value }) => {
    this.setState({ searchOption: value }, () => this.handleSearch());
  };

  handleSearch = () => {
    const { keyword } = this.state;
    if (this.timer) {
      clearTimeout(this.timer);
    }

    let stateString, routeString;
    const { activeItem, searchOption } = this.state;
    switch (activeItem) {
      case 'Users':
        stateString = 'userState';
        routeString = 'user';
        break;
      case 'Goods':
        stateString = 'goodsState';
        routeString = 'goods';
        break;
      case 'Orders':
        stateString = 'orderState';
        routeString = 'order';
        break;
      default:
        break;
    }

    this.timer = setTimeout(async () => {
      try {
        this.setState({ loading: true });
        const { data } = await axios.post(`/api/${routeString}/search`, {
          keyword,
          [stateString]: searchOption
        });
        if (data.message === 'success') {
          this.setState({
            [activeItem.toLowerCase()]: data[activeItem.toLowerCase()]
          });
        }
        this.setState({ loading: false });
      } catch (e) {}
    }, 500);
  };

  renderActionButton = (goodsState, good) => {
    switch (goodsState) {
      case 0:
        return (
          <Button
            animated="fade"
            color="green"
            onClick={() => this.onActionButtonClick(good, 1)}
          >
            <Button.Content hidden>Mount</Button.Content>
            <Button.Content visible>
              <Icon name="arrow up" />
            </Button.Content>
          </Button>
        );
      case 1:
        return (
          <Button
            animated="fade"
            color="red"
            onClick={() => this.onActionButtonClick(good, 0)}
          >
            <Button.Content hidden>Unmount</Button.Content>
            <Button.Content visible>
              <Icon name="close" />
            </Button.Content>
          </Button>
        );
      case 2:
      default:
        return <></>;
    }
  };

  renderWelcomeSegment() {
    return (
      <>
        <Header size="huge" floated="left">
          <Icon name="user" />
          <Header.Content>
            Hello, {this.props.userName}, Dear System Administrator
          </Header.Content>
        </Header>
        <CreateUser finish={() => this.fetchData()} />
      </>
    );
  }

  renderSelector() {
    const { activeItem } = this.state;
    const items = ['Goods', 'Orders', 'Users'];
    const orderOptions = [
      { key: -1, text: 'ALL', value: -1 },
      { key: 0, text: 'FROZEN', value: 0 },
      { key: 1, text: 'ONGOING', value: 1 },
      { key: 2, text: 'FINISHED', value: 2 },
      { key: 3, text: 'ABORTED', value: 3 }
    ];
    const goodsOptions = [
      { key: -1, text: 'ALL', value: -1 },
      { key: 0, text: 'FROZEN', value: 0 },
      { key: 1, text: 'ON SALE', value: 1 },
      { key: 2, text: 'SOLD OUT', value: 2 }
    ];
    const userOptions = [
      { key: -1, text: 'ALL', value: -1 },
      { key: 0, text: 'FROZEN', value: 0 },
      { key: 1, text: 'NORMAL', value: 1 },
      { key: 5, text: 'SUPER ADMIN', value: 5 }
    ];
    const options =
      this.state.activeItem === 'Users'
        ? userOptions
        : this.state.activeItem === 'Goods'
        ? goodsOptions
        : orderOptions;

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
            <Input
              icon="search"
              onChange={(e, { value }) => {
                this.setState({ keyword: value });
                this.handleSearch();
              }}
              placeholder="Search..."
              value={this.state.keyword}
              label={
                <Dropdown
                  options={options}
                  onChange={this.onSearchOptionChange}
                  value={this.state.searchOption}
                />
              }
            />
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
    const { goods } = this.state;
    if (goods.length === 0) {
      return <BlankSegment />;
    }
    return (
      <Item.Group divided>
        {_.map(goods, good => {
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
                    <Container
                      text
                      style={{ color: goodsState === 0 ? 'red' : '' }}
                    >
                      {stateToText[goodsState]}
                    </Container>
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
                    {this.renderActionButton(goodsState, good)}
                    <DeleteModal
                      finish={() => this.fetchData()}
                      table="goods"
                      id={goodsId}
                    />
                  </Grid.Column>
                </Grid>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    );
  }

  renderOrdersList() {
    const stateToText = {
      0: 'Frozen',
      1: 'On Going',
      2: 'Finished',
      3: 'Aborted'
    };
    const columnNames = [
      { key: 'Goods Name', value: 'goodsName' },
      { key: 'Order ID', value: 'orderId' },
      { key: 'State', value: 'orderState' },
      { key: 'Buyer', value: 'buyerName' },
      { key: 'Seller', value: 'sellerName' },
      { key: 'Generate Time', value: 'generateTime' }
    ];
    const { column, orders, direction } = this.state;
    if (orders.length === 0) {
      return <BlankSegment />;
    }
    return (
      <Table singleLine selectable sortable>
        <Table.Header>
          <Table.Row>
            {_.map(
              _.map(columnNames, ({ key, value }) => (
                <Table.HeaderCell
                  key={key}
                  sorted={column === value ? direction : null}
                  onClick={() => this.handleSort(value, 'orders')}
                >
                  {key}
                </Table.HeaderCell>
              ))
            )}
            <Table.HeaderCell>Operation</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(orders, order => {
            const {
              goodsName,
              orderId,
              goodsId,
              generateTime,
              buyerId,
              buyerName,
              sellerId,
              sellerName,
              orderState
            } = order;

            return (
              <Table.Row
                negative={orderState === (0 || 3)}
                positive={orderState === 2}
                warning={orderState === 1}
                key={orderId}
              >
                <Table.Cell>
                  <Header as={Link} to={`/goods/${goodsId}`}>
                    {goodsName}
                  </Header>
                </Table.Cell>
                <Table.Cell>{orderId}</Table.Cell>
                <Table.Cell>{stateToText[orderState]}</Table.Cell>
                <Table.Cell>
                  <Link to={`/user/${buyerId}`}>{buyerName}</Link>
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/user/${sellerId}`}>{sellerName}</Link>
                </Table.Cell>
                <Table.Cell>{generateTime}</Table.Cell>
                <Table.Cell>
                  <EditOrder finish={() => this.fetchData()} order={order} />
                  <DeleteModal
                      finish={() => this.fetchData()}
                      table="order"
                      id={orderId}
                    />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    );
  }

  renderUsersList() {
    const stateToText = {
      0: 'Frozen',
      1: 'Normal User',
      5: 'Super Admin'
    };
    const columnNames = [
      { key: 'Name', value: 'userName' },
      { key: 'ID', value: 'userId' },
      { key: 'State', value: 'userState' },
      { key: 'phoneNumber', value: 'phoneNumber' },
      { key: 'Address', value: 'address' },
      { key: 'Password', value: 'password' }
    ];
    const { column, users, direction } = this.state;
    return (
      <Table singleLine selectable sortable>
        <Table.Header>
          <Table.Row>
            {_.map(columnNames, ({ key, value }) => (
              <Table.HeaderCell
                key={key}
                sorted={column === value ? direction : null}
                onClick={() => this.handleSort(value, 'users')}
              >
                {key}
              </Table.HeaderCell>
            ))}

            <Table.HeaderCell>Operation</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(users, user => {
            const {
              userId,
              userName,
              address,
              phoneNumber,
              password,
              userState
            } = user;
            return (
              <Table.Row negative={userState === 0} key={userId}>
                <Table.Cell>
                  <Header size="large" as={Link} to={`/user/${userId}`}>
                    {userName}
                  </Header>
                </Table.Cell>
                <Table.Cell>{userId}</Table.Cell>
                <Table.Cell>{stateToText[userState]}</Table.Cell>
                <Table.Cell>{phoneNumber}</Table.Cell>
                <Table.Cell>{address}</Table.Cell>
                <Table.Cell>{password}</Table.Cell>
                <Table.Cell>
                  <EditUser finish={() => this.fetchData()} user={user} />
                  <DeleteModal
                      finish={() => this.fetchData()}
                      table="user"
                      id={userId}
                    />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
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
        <Segment vertical loading={this.state.loading}>
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
