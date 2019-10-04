import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Goods from './goods/index';
import GoodsDetail from './goods/GoodsDetail';
import Order from './order/index';
import User from './user/index';
import Administer from './administer/index';
import Login from './login/index';
import Register from './register/index';

class App extends React.Component {
  render() {
    // Global routes settings
    return (
      <div>
        <Router history={createBrowserHistory()}>
          <Switch />
          <Route path="/" exact component={Goods} />
          <Route path="/goods" exact component={Goods} />
          <Route path="/goods/:goodsId" exact component={GoodsDetail} />
          <Route path="/order" exact component={Order} />
          <Route path="/user/:userId" exact component={User} />
          <Route path="/administer" exact component={Administer} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
        </Router>
      </div>
    );
  }
}

export default App;
