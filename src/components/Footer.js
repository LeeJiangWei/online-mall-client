import React from 'react';
import { Divider, Container } from 'semantic-ui-react';

class Footer extends React.Component {
  render() {
    return (
      <>
        <Divider />
        <Container textAlign="center" style={{ marginBottom: '1em' }}>
          Powered by 0x26E development team
        </Container>
      </>
    );
  }
}

export default Footer;
