import React from 'react';
import {
  Segment,
  Statistic,
  Grid,
  Header,
  Card,
  Icon,
  Image
} from 'semantic-ui-react';
import axios from 'axios';

class Goods extends React.Component {
  state = { goods: [] };

  async componentDidMount() {
    try {
      const { data } = await axios.get('/api/goods/');
      const { message, goods } = data;
      if (message === 'success') {
        this.setState({ goods });
      }
    } catch (e) {}
  }

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
        <Segment vertical>
          <Grid columns={4}>{this.renderList()}</Grid>
        </Segment>
      </>
    );
  }
}

export default Goods;
