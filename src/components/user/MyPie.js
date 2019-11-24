import React from 'react';
import { PieChart, Pie, Cell, Tooltip, LabelList } from 'recharts';

const data = [{ name: 'you', value: 400 }, { name: 'suck', value: 300 }];

class MyPie extends React.PureComponent {
  renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  render() {
    const COLORS = ['#7FFF00', '#C0C0C0', '#0088FE', '#FF8042'];
    const { data } = this.props;
    return (
      <PieChart width={375} height={200}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={this.renderCustomizedLabel}
          fill="#8884d8"
          outerRadius={80}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }
}

export default MyPie;
