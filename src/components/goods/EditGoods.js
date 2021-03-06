import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import {
  Button,
  Form,
  Grid,
  TextArea,
  Icon,
  Image,
  Segment,
  Input,
  Divider,
  Container
} from 'semantic-ui-react';
import { setGlobalPortal } from '../../actions';

const options = [
  { key: 1, text: 'On sale', value: 1 },
  { key: 0, text: 'Frozen good', value: 0 },
  { key: 2, text: 'Sold out', value: 2 }
];

class EditGoods extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      goodsId: this.props.match.params.goodsId,
      isCreatingNewGoods: this.props.match.path === '/goods/new',
      goods: {
        category: '',
        description: '',
        goodsId: -1,
        goodsName: '',
        goodsState: 1,
        picture: '',
        postTime: '',
        price: 0.0,
        userId: 0
      }
    };
  }

  onInputChange = e => {
    let goods = { ...this.state.goods };
    goods[e.target.name] = e.target.value;
    this.setState({ goods });
  };

  onSelectChange = (e, { value }) => {
    let goods = { ...this.state.goods };
    goods.goodsState = value;
    this.setState({ goods });
  };

  submitData = () => {
    const submitUrl = this.state.isCreatingNewGoods
      ? '/api/goods/add'
      : `/api/goods/${this.state.goodsId}`;
    const that = this;
    axios.post(submitUrl, this.state.goods).then(res => {
      if (res.data.message === 'success') {
        this.props.setGlobalPortal(
          true,
          'info',
          'Success',
          'Successfully update your goods.'
        );
        that.clearData();
        this.props.history.goBack();
      } else {
        this.props.setGlobalPortal(
          true,
          'negative',
          'Failure',
          res.data.message
        );
      }
    });
  };

  clearData = () => {
    const goods = {
      category: '',
      description: '',
      goodsId: -1,
      goodsName: '',
      goodsState: 1,
      picture: '',
      postTime: '',
      price: 0.0,
      userId: 0
    };
    this.setState({ goods });
  };

  onFileInputChange = event => {
    this.setState({ loading: true });
    let imageForm = new FormData();
    imageForm.append('smfile', event.target.files[0]);
    axios
      .post('https://sm.ms/api/upload', imageForm, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(res => {
        this.setState({ loading: false });
        if (res.data && res.data.success) {
          let goods = { ...this.state.goods };
          goods.picture = res.data.data.url;
          this.setState({ goods });
        } else {
          this.props.setGlobalPortal(
            true,
            'negative',
            'Failure',
            res.data.message
          );
        }
      });
  };

  componentDidMount() {
    const that = this;
    if (!that.state.isCreatingNewGoods) {
      axios
        .get('/api/goods/' + that.state.goodsId)
        .then(function(res) {
          if (res.data.message === 'success') {
            that.setState({
              goods: res.data.goods
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
      <Segment loading={this.state.loading}>
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
                    onChange={this.onSelectChange}
                    options={options}
                    placeholder="State"
                  />
                </Form.Group>
                <Form.Field>
                  <input
                    ref="imageInput"
                    type="file"
                    id="uploadImage"
                    name="file"
                    accept="image/*"
                    onChange={this.onFileInputChange}
                    style={{ display: 'none' }}
                  />
                  <label>Picture</label>
                  <Input
                    action={{
                      icon: 'upload',
                      onClick: () => {
                        this.refs.imageInput.click();
                      }
                    }}
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
              <Button animated="fade" size="large" onClick={this.clearData}>
                <Button.Content hidden>RESET</Button.Content>
                <Button.Content visible>
                  <Icon name="undo" />
                </Button.Content>
              </Button>
              <Button
                animated="fade"
                size="large"
                color="green"
                onClick={this.submitData}
              >
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

export default connect(
  null,
  { setGlobalPortal }
)(EditGoods);
