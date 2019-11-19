import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Header, Icon, Modal, Form } from 'semantic-ui-react';
import { setGlobalPortal } from '../../actions';

class CreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      address: '',
      phoneNumber: '',
      modalOpen: false,
      processing: false
    };
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  handleSubmit = async () => {
    const { userName, password, address, phoneNumber } = this.state;
    this.setState({ processing: true });
    try {
      const res = await axios.post('/api/user/register', {
        userName,
        password,
        address,
        phoneNumber
      });
      const message = res.data.message;
      if (message === 'success') {
        this.props.setGlobalPortal(
          true,
          'info',
          'Success',
          'New account has been successfully create.'
        );
      } else {
        this.props.setGlobalPortal(true, 'negative', 'Failure', message);
      }
      this.setState({ modalOpen: false, processing: false });
      this.props.finish();
    } catch (e) {
      this.props.setGlobalPortal(
        true,
        'negative',
        'Network Error',
        e.toString()
      );
    }
  };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  renderForm() {
    const { userName, password, address, phoneNumber } = this.state;
    return (
      <Form loading={this.state.processing}>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Name"
            name="userName"
            placeholder="Name"
            onChange={this.handleChange}
            value={userName}
          />
          <Form.Input
            fluid
            label="Password"
            name="password"
            placeholder="Password"
            onChange={this.handleChange}
            value={password}
          />
          <Form.Input
            fluid
            label="Phone Number"
            name="phoneNumber"
            placeholder="Phone Number"
            onChange={this.handleChange}
            value={phoneNumber}
          />
        </Form.Group>
        <Form.TextArea
          label="Address"
          name="address"
          placeholder="Tell us where you are..."
          onChange={this.handleChange}
          value={address}
        />
      </Form>
    );
  }

  render() {
    return (
      <Modal
        trigger={
          <Button animated="fade" floated="right" onClick={this.handleOpen}>
            <Button.Content visible>Create Account</Button.Content>
            <Button.Content hidden>
              <Icon name="user plus" />
            </Button.Content>
          </Button>
        }
        dimmer="inverted"
        open={this.state.modalOpen}
        onClose={this.handleClose}
        size="large"
      >
        <Header icon="user plus" content="Create User Account" />
        <Modal.Content>{this.renderForm()}</Modal.Content>
        <Modal.Actions>
          <Button color="green" onClick={this.handleSubmit} inverted>
            <Icon name="checkmark" /> Submit
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default connect(
  null,
  { setGlobalPortal }
)(CreateUser);
