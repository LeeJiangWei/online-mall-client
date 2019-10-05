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
import faker from 'faker';

let fakeGoods = [];

for (let i = 0; i < 9; i++) {
  fakeGoods.push({
    id: i,
    img: faker.image.image(),
    name: faker.commerce.productName(),
    cat: faker.commerce.department(),
    des: faker.lorem.sentence()
  });
}

class Goods extends React.Component {
  onCardClicked = id => {
    this.props.history.push(`/goods/${id}`);
  };

  renderList(goods) {
    return goods.map(good => {
      return (
        <Grid.Column key={good.name}>
          <Card onClick={() => this.onCardClicked(good.id)}>
            <Image src={good.img} />
            <Card.Content>
              <Card.Header>{good.name}</Card.Header>
              <Card.Meta>{good.cat}</Card.Meta>
              <Card.Description style={{ height: '3em' }}>
                {good.des}
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
      );
    });
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
              <Statistic.Value>4,396</Statistic.Value>
              <Statistic.Label>Goods on sale</Statistic.Label>
            </Statistic>
          </Header>
        </Segment>
        <Segment vertical>
          <Grid columns={4}>{this.renderList(fakeGoods)}</Grid>
        </Segment>
      </>
    );
  }
}

export default Goods;
