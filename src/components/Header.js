import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Container, Icon } from 'semantic-ui-react';

import { logout, setGlobalPortal } from '../actions';

class Header extends React.Component {
  state = { activeItem: 'goods', status: 2, userId: -1, userState: 1 };

  componentDidMount() {
    this.setState({
      activeItem: this.props.location.pathname.split('/')[1]
    });
  }

  static getDerivedStateFromProps(props) {
    return {
      status: props.status,
      userId: props.user.userId,
      userState: props.user.userState
    };
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  onLogoutClick = async () => {
    const message = await this.props.logout();
    this.props.setGlobalPortal(true, 'info', 'success', message);
    this.props.history.push('/login');
    //window.alert(message);
  };

  renderLoginOrLogout = () => {
    const { activeItem } = this.state;

    if (this.state.status === 1) {
      return <Menu.Item name="logout" onClick={this.onLogoutClick} />;
    } else {
      return (
        <Menu.Item
          name="login"
          as={Link}
          to="/login"
          active={activeItem === 'login'}
          onClick={this.handleItemClick}
        />
      );
    }
  };

  render() {
    const { activeItem } = this.state;

    return (
      <div>
        <Menu fixed="top" size="massive" pointing>
          <Container>
            <Menu.Item
              as={Link}
              to="/"
              name="goods"
              onClick={this.handleItemClick}
            >
              <Icon name="home" />
              Online Shopping Mall
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/"
              name="goods"
              active={activeItem === 'goods'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              as={Link}
              to="/order"
              name="order"
              active={activeItem === 'order'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              as={Link}
              to={`/user/${this.state.userId}`}
              name="user"
              active={activeItem === 'user'}
              onClick={this.handleItemClick}
            />
            {this.state.userState === 5 && (
              <Menu.Item
                as={Link}
                to="/administer"
                name="admin"
                active={activeItem === 'admin'}
                onClick={this.handleItemClick}
              >
                Admin
              </Menu.Item>
            )}
            <Menu.Menu position="right">{this.renderLoginOrLogout()}</Menu.Menu>
          </Container>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

export default connect(
  mapStateToProps,
  { logout, setGlobalPortal }
)(Header);
