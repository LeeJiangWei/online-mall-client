import React from 'react';

class GoodsDetail extends React.Component {
  render() {
    // Get params in url
    return <h1>Goods detail for id: {this.props.match.params.goodsId}</h1>;
  }
}

export default GoodsDetail;
