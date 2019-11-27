import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Modal, Icon, Message } from 'semantic-ui-react';
import { setGlobalPortal } from '../../actions';

class DeleteModal extends React.Component {
  state = { open: false };

  close = () => this.setState({ open: false });

  onDeleteButtonClick = async (table, id) => {
    try {
      const { data } = await axios.delete(`/api/${table}/${id}`);
      const { message } = data;
      if (message === 'success') {
        this.props.setGlobalPortal(
          true,
          'info',
          'Success',
          'Successfully delete record recursively in database.'
        );
      } else {
        this.props.setGlobalPortal(true, 'negative', 'Failure', message);
      }
      this.props.finish();
      this.setState({ open: false });
    } catch (e) {
      this.props.setGlobalPortal(
        true,
        'negative',
        'Network Error',
        e.toString()
      );
    }
  };

  render() {
    const { open } = this.state;
    const { table, id } = this.props;
    return (
      <Modal
        trigger={
          <Button
            negative
            animated="fade"
            onClick={() => this.setState({ open: true })}
          >
            <Button.Content hidden>
              <Icon name="warning sign" />
            </Button.Content>
            <Button.Content visible>
              <Icon name="erase" />
            </Button.Content>
          </Button>
        }
        open={open}
        onClose={this.close}
      >
        <Modal.Header>
          Delete record of {table} with ID: {id}
        </Modal.Header>
        <Modal.Content>
          <p>Are you sure you want to delete the record in database?</p>
          <Message
            error
            header="You should not do this in general!!!"
            list={[
              'This opreation will delete all the other associated records.',
              'This is not a normal operation in a web APP, but we still perform it for the integrity of database operations.'
            ]}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => this.onDeleteButtonClick(table, id)} negative>
            Delete Anyway
          </Button>
          <Button onClick={this.close}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default connect(
  null,
  { setGlobalPortal }
)(DeleteModal);
