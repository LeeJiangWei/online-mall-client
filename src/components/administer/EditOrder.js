import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Header, Icon, Modal, Form, Message } from 'semantic-ui-react';
import { setGlobalPortal } from '../../actions';

class EditOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...props.order, modalOpen: false, processing: false };
  }

  handleOpen = () => this.setState({ modalOpen: true });

  handleClose = () => this.setState({ modalOpen: false });

  handleSubmit = async () => {
    const { orderId, orderState } = this.state;
    this.setState({ processing: true });
    try {
      const res = await axios.post(`/api/order/${orderId}`, {
        orderState
      });
      const message = res.data.message;
      if (message === 'success') {
        this.props.setGlobalPortal(
          true,
          'info',
          'Success',
          'Order state has been successfully updated.'
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
    const { orderState } = this.state;
    const options = [
      { key: 'm', text: 'Frozen', value: 0 },
      { key: 'f', text: 'Ongoing', value: 1 },
      { key: 'o', text: 'Finished', value: 2 },
      { key: 'q', text: 'Aborted', value: 3 }
    ];
    return (
      <Form loading={this.state.processing} warning>
        <Form.Select
          fluid
          label="State"
          name="orderState"
          options={options}
          placeholder="State"
          onChange={this.handleChange}
          value={orderState}
        />
        <Message
          warning
          header="You should not modify order state in general!"
          list={[
            'Order state is usually edit by user action, i.e., buying goods, ack receiving goods.',
            "Frozen: Frozen orders will not appear in user's pages",
            'Ongoing: Buyer created a order, but not finished yet',
            'Finished: Buyer acknowledged that the goods has been received',
            'Aborted: Buyer or seller canceled the order'
          ]}
        />
      </Form>
    );
  }

  render() {
    return (
      <Modal
        trigger={
          <Button animated="fade" onClick={this.handleOpen}>
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
        <Header icon="edit" content="Edit Order State" />
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
)(EditOrder);
