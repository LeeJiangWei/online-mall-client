import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Container, Icon } from 'semantic-ui-react';

class Header extends React.Component {
  state = { activeItem: 'goods' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

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
              name="orders"
              active={activeItem === 'orders'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              as={Link}
              to="/user/1"
              name="user"
              active={activeItem === 'user'}
              onClick={this.handleItemClick}
            />
            <Menu.Menu position="right">
              <Menu.Item name="logout" onClick={this.handleItemClick} />
            </Menu.Menu>
          </Container>
        </Menu>
      </div>
    );
  }
}

export default Header;
