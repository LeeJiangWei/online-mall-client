import React from 'react';
import _ from 'lodash';
import {
  Segment,
  Statistic,
  Grid,
  Header,
  Card,
  Icon,
  Image,
  Menu
} from 'semantic-ui-react';
import axios from 'axios';

class Goods extends React.Component {
  state = { goods: [], loading: false };

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    try {
      this.setState({ loading: true });
      const { data } = await axios.get('/api/goods/');
      let { message, goods } = data;
      if (message === 'success') {
        goods = _.filter(goods, ({ goodsState }) => {
          return goodsState === 1;
        });
        this.setState({ goods });
      }
      this.setState({ loading: false });
    } catch (e) {}
  };

  onCardClicked = id => {
    this.props.history.push(`/goods/${id}`);
  };

  renderList() {
    return this.state.goods.map(
      ({ goodsName, price, picture, goodsId, category }) => {
        return (
          <Grid.Column key={goodsId}>
            <Card onClick={() => this.onCardClicked(goodsId)}>
              <Image src={picture} />
              <Card.Content>
                <Card.Header>{goodsName}</Card.Header>
                <Card.Meta>{category}</Card.Meta>
                <Card.Description style={{ height: '3em' }}>
                  Price: {price}
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        );
      }
    );
  }

  renderFilter() {
    return (
      <Menu secondary>
        <Menu.Item icon="x" name="home" />
        <Menu.Item name="messages" />
        <Menu.Item name="friends" />
        <Menu.Menu position="right">
          <Menu.Item name="logout" />
        </Menu.Menu>
      </Menu>
    );
  }

  render() {
    return (
      <>
        <Segment clearing vertical>
          <Header size="huge" floated="left">
            <Icon name="shopping bag" />
            <Header.Content>Hello, Welcome to shopping mall!</Header.Content>
          </Header>
          <Header floated="right">
            <Statistic>
              <Statistic.Value>{this.state.goods.length}</Statistic.Value>
              <Statistic.Label>Goods on sale</Statistic.Label>
            </Statistic>
          </Header>
        </Segment>
        <Segment loading={this.state.loading} vertical>
          {this.renderFilter()}
          <Grid columns={4}>{this.renderList()}</Grid>
        </Segment>
      </>
    );
  }
}

export default Goods;
