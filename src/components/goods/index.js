import React from 'react';
import _ from 'lodash';
import axios from 'axios';
import {
  Segment,
  Statistic,
  Grid,
  Header,
  Card,
  Icon,
  Image,
  Menu,
  Input
} from 'semantic-ui-react';

class Goods extends React.Component {
  state = { goods: [], loading: false, activeItem: '', direction: 'up' };

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

  onMenuClick = (e, { name }) => {
    const { activeItem, direction, goods } = this.state;
    console.log(name);
    if (name !== activeItem) {
      this.setState({
        activeItem: name,
        direction: 'angle up',
        goods: _.sortBy(goods, [name])
      });
    } else {
      this.setState({
        goods: goods.reverse(),
        direction: direction === 'angle up' ? 'angle down' : 'angle up'
      });
    }
  };

  handleSearch = e => {
    const keyword = e.target.value;
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(async () => {
      try {
        this.setState({ loading: true });
        const { data } = await axios.post('/api/goods/search', {
          keyword,
          goodsState: 1
        });
        const { message, goods } = data;
        if (message === 'success') {
          this.setState({
            goods: _.filter(goods, ({ goodsState }) => {
              return goodsState === 1;
            })
          });
        }
        this.setState({ loading: false });
      } catch (e) {}
    }, 1000);
  };

  renderList() {
    return _.map(
      this.state.goods,
      ({ goodsName, price, picture, goodsId, category, postTime }) => {
        return (
          <Grid.Column key={goodsId}>
            <Card onClick={() => this.onCardClicked(goodsId)}>
              <Image style={{ height: '260.75px' }} src={picture} centered />
              <Card.Content>
                <Card.Header>{goodsName}</Card.Header>
                <Card.Meta>{category}</Card.Meta>
                <Card.Description>￥ {price}</Card.Description>
              </Card.Content>
              <Card.Content extra>Post Time: {postTime}</Card.Content>
            </Card>
          </Grid.Column>
        );
      }
    );
  }

  renderFilter() {
    const items = ['price', 'postTime', 'category'];
    const { activeItem, direction } = this.state;
    return (
      <Menu secondary>
        {_.map(items, item => (
          <Menu.Item
            key={item}
            icon={activeItem === item ? direction : null}
            name={item}
            active={activeItem === item}
            onClick={this.onMenuClick}
          />
        ))}
        <Menu.Menu position="right">
          <Input
            icon="search"
            onChange={this.handleSearch}
            placeholder="Search..."
          />
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
