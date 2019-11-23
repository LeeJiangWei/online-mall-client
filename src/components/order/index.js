import React from 'react';
import axios from 'axios';
import {
  Container,
  Dropdown,
  Input,
  Card,
  Segment,
  Button,
  Menu,
  Icon
} from 'semantic-ui-react';

import { setGlobalPortal } from '../../actions';
import { connect } from 'react-redux';

const orderStates = [
  { key: 0, text: 'FROZEN', value: 0 },
  { key: 1, text: 'ONGOING', value: 1 },
  { key: 2, text: 'FINISHED', value: 2 },
  { key: 3, text: 'ABORTED', value: 3 },
  { key: -1, text: 'ALL', value: -1 }
];

const ORDER = {
  FROZEN: 0,
  ONGOING: 1,
  FINISHED: 2,
  ABORTED: 3
};

class Order extends React.Component {
  state = {
    orders: [],
    loading: false,
    searchTypingTimeout: 0,
    searchOption: -1,
    asBuyer: true
  };

  async componentDidMount() {
    await this.loadOrdersFromServer();
  }

  onSearchOptionChange = (e, { value }) => {
    this.setState({ searchOption: value });
  };

  searchOrders = e => {
    let keyword = e.target.value;
    if (this.state.searchTypingTimeout) {
      clearTimeout(this.state.searchTypingTimeout);
    }
    this.setState({
      searchTypingTimeout: setTimeout(() => {
        const that = this;
        axios
          .post(`/api/order/search`, {
            orderState: this.state.searchOption,
            keyword,
            asBuyer: this.state.asBuyer
          })
          .then(async function(res) {
            if (res.data.message === 'success') {
              const { message, orders } = res.data;
              if (message === 'success') {
                that.setState({ orders });
              } else {
                that.props.setGlobalPortal(
                  true,
                  'negative',
                  'Failure',
                  message
                );
              }
            } else {
              this.props.setGlobalPortal(
                true,
                'negative',
                'Failure',
                res.data.message
              );
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      }, 500)
    });
  };
  async loadOrdersFromServer() {
    try {
      this.setState({ loading: true });
      const { data } = await axios.get('/api/order');
      const { message, orders } = data;
      if (message === 'success') {
        this.setState({ orders });
      } else {
        this.props.setGlobalPortal(true, 'negative', 'Failure', message);
      }
      this.setState({ loading: false });
    } catch (e) {}
  }

  onGoodsButtonClicked = id => {
    this.props.history.push(`/goods/${id}`);
  };

  switchRole = () => {
    this.setState({ asBuyer: !this.state.asBuyer });
  };

  setOrderState = (id, state) => {
    const that = this;
    axios
      .post('/api/order/' + id, { orderState: state })
      .then(async function(res) {
        if (res.data.message === 'success') {
          await that.loadOrdersFromServer();
        } else {
          this.props.setGlobalPortal(
            true,
            'negative',
            'Failure',
            res.data.message
          );
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  };

  renderList() {
    return this.state.orders.map(
      ({
        orderId,
        goodsName,
        orderState,
        generateTime,
        category,
        price,
        goodsId
      }) => {
        let abortOrderButton = '';
        let makeAsFinishedButton = '';
        if (orderState === ORDER.ONGOING && this.state.asBuyer) {
          abortOrderButton = (
            <Button
              basic
              color="red"
              onClick={() => this.setOrderState(orderId, ORDER.ABORTED)}
              labelPosition="left"
              icon
            >
              <Icon name="x" />
              Abort Order
            </Button>
          );
          makeAsFinishedButton = (
            <Button
              basic
              color="green"
              onClick={() => this.setOrderState(orderId, ORDER.FINISHED)}
              labelPosition="left"
              icon
            >
              <Icon name="checkmark" />
              Mark As Finished
            </Button>
          );
        }
        return (
          <Card fluid key={orderId}>
            <Card.Content>
              <Card.Header>
                {'Order id: ' +
                  orderId +
                  ' | Goods name: ' +
                  goodsName +
                  ' | Category: ' +
                  category}
              </Card.Header>
              <Card.Meta>
                {(orderStates[orderState]
                  ? orderStates[orderState].text
                  : 'UNKNOWN') +
                  ' ' +
                  generateTime +
                  ` ￥${price}`}
              </Card.Meta>
              <Card.Description>
                <Button
                  basic
                  color="blue"
                  onClick={() => this.onGoodsButtonClicked(goodsId)}
                  labelPosition="left"
                  icon
                >
                  <Icon name="eye" />
                  View Good Detail
                </Button>
                {abortOrderButton}
                {makeAsFinishedButton}
              </Card.Description>
            </Card.Content>
          </Card>
        );
      }
    );
  }

  render() {
    return (
      <Container>
        <Menu secondary>
          <Menu.Item
            key={0}
            active={this.state.asBuyer}
            name={'As Buyer'}
            onClick={this.switchRole}
          />
          <Menu.Item
            key={1}
            active={!this.state.asBuyer}
            name={'As Seller'}
            onClick={this.switchRole}
          />
          <Menu.Menu position="right">
            <Menu.Item>
              <Input
                size="large"
                label={
                  <Dropdown
                    defaultValue={-1}
                    options={orderStates}
                    onChange={this.onSearchOptionChange}
                  />
                }
                labelPosition="left"
                icon="search"
                placeholder='Press "Enter" to search...'
                onChange={this.searchOrders}
              />
            </Menu.Item>
          </Menu.Menu>
        </Menu>

        <Segment vertical loading={this.state.loading}>
          {this.renderList()}
        </Segment>
      </Container>
    );
  }
}

export default connect(
  null,
  { setGlobalPortal }
)(Order);
