import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Header, Icon, Modal, Form } from 'semantic-ui-react';
import { setGlobalPortal } from '../../actions';

class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props.user, modalOpen: false, processing: false };
  }

  static getDerivedStateFromProps(props) {
    return { ...props.user };
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  handleSubmit = async () => {
    const {
      userId,
      userName,
      password,
      address,
      phoneNumber,
      userState
    } = this.state;
    this.setState({ processing: true });
    try {
      const res = await axios.post(`/api/user/${userId}`, {
        userId,
        userName,
        password,
        address,
        phoneNumber,
        userState
      });
      const message = res.data.message;
      if (message === 'success') {
        this.props.setGlobalPortal(
          true,
          'info',
          'Success',
          'User information has been successfully updated.'
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
    const { userName, password, address, phoneNumber, userState } = this.state;
    const options = [
      { key: 'm', text: 'Frozen', value: 0 },
      { key: 'f', text: 'Normal', value: 1 },
      { key: 'o', text: 'Super Admin', value: 5 }
    ];
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
          <Form.Select
            fluid
            label="State"
            name="userState"
            options={options}
            placeholder="State"
            onChange={this.handleChange}
            value={userState}
            disabled={this.props.disableState}
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
          <Button
            floated={this.props.floated}
            animated="fade"
            onClick={this.handleOpen}
          >
            <Button.Content hidden>Edit</Button.Content>
            <Button.Content visible>
              <Icon name="edit" />
            </Button.Content>
          </Button>
        }
        dimmer="inverted"
        open={this.state.modalOpen}
        onClose={this.handleClose}
        size="large"
      >
        <Header icon="edit" content="Edit User Information" />
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
)(EditUser);
