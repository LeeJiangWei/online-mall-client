import React from "react";
import axios from "axios";
import {
  Button,
  Grid,
  Header,
  Icon,
  Image,
  Segment,
  Divider,
  Container
} from "semantic-ui-react";

class GoodsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goodsId: this.props.match.params.goodsId,
      goods: {
        category: undefined,
        description: undefined,
        goodsId: undefined,
        goodsName: undefined,
        goodsState: undefined,
        picture: undefined,
        postTime: undefined,
        price: undefined,
        userId: undefined
      },
      seller: {
        userId: undefined,
        userName: undefined,
        address: undefined,
        phoneNumber: undefined,
        userState: undefined
      }
    };
  }

  componentDidMount() {
    const that = this;
    axios
      .get("/api/goods/" + this.state.goodsId)
      .then(function(res) {
        if (res.data.message === "success") {
          that.setState({
            goods: res.data.goods,
            seller: res.data.seller
          });
        } else {
          console.error(res.data.message);
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  render() {
    const { goods, seller } = this.state;
    return (
      <Segment>
        <Grid columns={2} relaxed="very">
          <Grid.Column>
            <Image src={goods.picture} size="large" />
          </Grid.Column>
          <Grid.Column>
            <div>
              <Header as="h1">{goods.goodsName}</Header>
              <Header as="h3">
                State: {goods.goodsState === 1 ? "in stock" : "sold out"}
              </Header>
              <Header as="h3">Category: {goods.category}</Header>
              <Header as="h3">Price: ￥{goods.price}</Header>
              <Header as="h3">Post time: {goods.postTime}</Header>
              <Header as="h3">Seller address: {seller.address}</Header>
              <Header as="h3">Description: {goods.description}</Header>
            </div>
            <Divider horizontal>BUY IT NOW</Divider>
            <Container textAlign="center">
              <Button animated="fade" size="large">
                <Button.Content hidden>Buy</Button.Content>
                <Button.Content visible>
                  <Icon name="shop" />
                </Button.Content>
              </Button>
            </Container>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default GoodsDetail;
