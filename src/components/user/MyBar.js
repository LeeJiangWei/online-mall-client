import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

class MyBar extends PureComponent {
  render() {
    const { data } = this.props;

    return (
      <BarChart
        width={375}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 40,
          left: 0,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="successful orders" fill="#7FFF00" />
        <Bar dataKey="failed orders" fill="#C0C0C0" />
      </BarChart>
    );
  }
}

export default MyBar;
