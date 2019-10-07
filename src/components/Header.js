import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Container, Icon } from 'semantic-ui-react';

import { logout } from '../utils/api';

class Header extends React.Component {
  state = { activeItem: 'goods', isLogin: false };

  componentDidMount() {
    console.log(this.props);
    this.setState({
      activeItem: this.props.location.pathname.split('/')[1]
    });
    console.log(this.state);
  }

  static getDerivedStateFromProps(props, state) {
    return { isLogin: props.isLogin };
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  onLogoutClick = async () => {
    const res = await logout();
    console.log(res.message);
    this.props.setAppState({ isLogin: false });
  };

  renderLoginOrLogout = () => {
    const { activeItem } = this.state;

    if (this.state.isLogin === true) {
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
              to="/user/1"
              name="user"
              active={activeItem === 'user'}
              onClick={this.handleItemClick}
            />
            <Menu.Menu position="right">{this.renderLoginOrLogout()}</Menu.Menu>
          </Container>
        </Menu>
      </div>
    );
  }
}

export default Header;
