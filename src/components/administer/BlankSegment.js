import React from 'react';
import { Segment, Header, Icon } from 'semantic-ui-react';

const BlankSegment = () => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="x" />
        No Data.
      </Header>
    </Segment>
  );
};

export default BlankSegment;
