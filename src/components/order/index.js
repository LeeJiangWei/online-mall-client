import React from 'react';
import axios from 'axios';
import {
  Container,
  Dropdown,
  Input,
  Card,
  Image,
  Segment,
  Button,
  Grid,
  Select
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
  state = { orders: [], loading: false };

  async componentDidMount() {
    await this.loadOrdersFromServer();
  }

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
      ({ orderId, orderState, generateTime, userId, goodsId }) => {
        let abortOrderButton = '';
        let makeAsFinishedButton = '';
        if (orderState === ORDER.ONGOING) {
          abortOrderButton = (
            <Button
              basic
              color="red"
              onClick={() => this.setOrderState(orderId, ORDER.ABORTED)}
            >
              Abort Order
            </Button>
          );
          makeAsFinishedButton = (
            <Button
              basic
              color="green"
              onClick={() => this.setOrderState(orderId, ORDER.FINISHED)}
            >
              Mark As Finished
            </Button>
          );
        }
        return (
          <Card fluid key={orderId}>
            <Card.Content>
              <Card.Header>{'Order id: ' + orderId}</Card.Header>
              <Card.Meta>
                {(orderStates[orderState]
                  ? orderStates[orderState].text
                  : 'UNKNOWN') +
                  ' ' +
                  generateTime}
              </Card.Meta>
              <Card.Description>
                <Button
                  basic
                  color="blue"
                  onClick={() => this.onGoodsButtonClicked(goodsId)}
                >
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
        <Input
          fluid
          size="large"
          label={<Dropdown defaultValue={-1} options={orderStates} />}
          labelPosition="left"
          icon="search"
          placeholder="Search your orders..."
        />
        <Segment loading={this.state.loading}>{this.renderList()}</Segment>
      </Container>
    );
  }
}

export default connect(
  null,
  { setGlobalPortal }
)(Order);
