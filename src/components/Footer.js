import React from 'react';
import { Segment, Container, Menu } from 'semantic-ui-react';

class Footer extends React.Component {
  render() {
    return (
      <Segment style={{ marginTop: '100vh' }}>
        <Container textAlign="center">Powered By Semantic UI</Container>
      </Segment>
    );
  }
}

export default Footer;
