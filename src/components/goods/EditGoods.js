import React from 'react';
import axios from 'axios';
import {
  Button,
  Form,
  Grid,
  TextArea,
  Icon,
  Image,
  Segment,
  Divider,
  Select,
  Container
} from 'semantic-ui-react';

const options = [
  { key: 1, text: 'On sale', value: 1 },
  { key: 0, text: 'Frozen good', value: 0 },
  { key: 2, text: 'Sold out', value: 2 }
];

class EditGoods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      goodsId: this.props.match.params.goodsId,
      isCreatingNewGoods: this.props.match.path === '/goods/new',
      goods: {
        category: '',
        description: '',
        goodsId: -1,
        goodsName: '',
        goodsState: 0,
        picture: '',
        postTime: '',
        price: 0.0,
        userId: 0
      },
      seller: {
        userId: 0,
        userName: '',
        address: '',
        phoneNumber: '',
        userState: 0
      }
    };
  }

  onInputChange = e => {
    let goods = { ...this.state.goods };
    goods[e.target.name] = e.target.value;
    this.setState({ goods });
    console.log(this.state.goods);
  };

  submitData() {}

  componentDidMount() {
    const that = this;
    if (!that.state.isCreatingNewGoods) {
      axios
        .get('/api/goods/' + that.state.goodsId)
        .then(function(res) {
          if (res.data.message === 'success') {
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
  }

  render() {
    return (
      <Segment>
        <Grid columns={2} relaxed="very">
          <Grid.Column>
            <Image src={this.state.goods.picture} size="large" />
          </Grid.Column>
          <Grid.Column>
            <Container>
              <Form>
                <Form.Field required>
                  <label>Goods name</label>
                  <input
                    placeholder="Goods name"
                    name="goodsName"
                    value={this.state.goods.goodsName}
                    onChange={this.onInputChange}
                  />
                </Form.Field>
                <Form.Group widths="equal">
                  <Form.Input
                    fluid
                    label="Category"
                    name="category"
                    value={this.state.goods.category}
                    onChange={this.onInputChange}
                    placeholder="Category"
                  />
                  <Form.Input
                    fluid
                    label="Price"
                    name="price"
                    value={this.state.goods.price}
                    type="number"
                    min="0"
                    onChange={this.onInputChange}
                    placeholder="Price"
                    required
                  />
                  <Form.Select
                    fluid
                    label="State"
                    name="goodsState"
                    value={this.state.goods.goodsState}
                    onChange={this.onInputChange}
                    options={options}
                    placeholder="State"
                  />
                </Form.Group>
                <Form.Field>
                  <label>Picture</label>
                  <input
                    placeholder="Picture url"
                    name="picture"
                    value={this.state.goods.picture}
                    onChange={this.onInputChange}
                  />
                </Form.Field>
                <Form.Field
                  control={TextArea}
                  label="Description"
                  name="description"
                  value={this.state.goods.description}
                  onChange={this.onInputChange}
                  placeholder="Description"
                />
              </Form>
            </Container>
            <Divider horizontal>EDIT</Divider>
            <Container textAlign="center">
              <Button animated="fade" size="large">
                <Button.Content hidden>RESET</Button.Content>
                <Button.Content visible>
                  <Icon name="undo" />
                </Button.Content>
              </Button>
              <Button animated="fade" size="large" onClick={this.submitData()}>
                <Button.Content hidden>SUBMIT</Button.Content>
                <Button.Content visible>
                  <Icon name="send" />
                </Button.Content>
              </Button>
            </Container>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default EditGoods;
