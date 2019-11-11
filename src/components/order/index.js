import React from 'react';
import axios from 'axios';

class Order extends React.Component {
  async componentDidMount() {
    const res = await axios.get('/api/order');
    // console.log(res);
  }

  render() {
    return <h1>Order page</h1>;
  }
}

export default Order;
