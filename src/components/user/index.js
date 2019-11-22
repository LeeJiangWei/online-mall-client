import React from 'react';
import _ from 'lodash';
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
    await this.fetchData();
  }

  fetchData = async () => {
    try {
      const res = await axios.get(
        `/api/user/${this.props.match.params.userId}`
      );
      const { message, user, goods } = res.data;
      if (message === 'success') {
        if (user) {
          this.setState({ user, goods });
        } else {
          this.props.setGlobalPortal(
            true,
            'negative',
            'Network error',
            'User not found'
          );
          this.props.history.push('/');
        }
      }
    } catch (e) {
      this.props.setGlobalPortal(
        true,
        'negative',
        'Network error',
        e.toString()
      );
    }
  };

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

  renderSellingGoods() {
    const isOwner =
      this.props.user.userId.toString() === this.props.match.params.userId;
    const stateToText = {
      0: 'Frozen',
      1: 'On sale',
      2: 'Sold out'
    };
    return (
      <Segment>
        <Header as="h2">Selling goods</Header>
        {isOwner && (
          <Button as={Link} to="/goods/new">
            New
          </Button>
        )}
        <Divider />
        <Item.Group>
          {this.state.goods.length === 0 ? (
            <Segment placeholder>
              <Header icon>
                <Icon name="x" />
                No Good is Selling.
              </Header>
              {isOwner && <Button primary>Sell</Button>}
            </Segment>
          ) : (
            _.map(this.state.goods, good => {
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
                      <Grid.Column width={3} verticalAlign="middle">
                        <Container
                          text
                          style={{ color: goodsState === 0 ? 'red' : '' }}
                        >
                          {stateToText[goodsState]}
                        </Container>
                      </Grid.Column>
                      {isOwner && (
                        <Grid.Column
                          width={5}
                          verticalAlign="middle"
                          textAlign="right"
                        >
                          <Button
                            animated="fade"
                            as={Link}
                            to={`/goods/edit/${goodsId}`}
                            disabled={goodsState === 2}
                          >
                            <Button.Content hidden>Edit</Button.Content>
                            <Button.Content visible>
                              <Icon name="edit" />
                            </Button.Content>
                          </Button>
                          {this.renderActionButton(goodsState, good)}
                        </Grid.Column>
                      )}
                    </Grid>
                  </Item.Content>
                </Item>
              );
            })
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
