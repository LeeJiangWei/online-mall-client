import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import 'semantic-ui-css/semantic.min.css';

import { Container } from 'semantic-ui-react';

import Header from './Header';
import Footer from './Footer';

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
      <HashRouter
        onUpdate={() => window.scrollTo(0, 0)}
        history={createBrowserHistory()}
      >
        <Header />
        <Container style={{ marginTop: '5em' }}>
          <Switch />
          <Route path="/" exact component={Goods} />
          <Route path="/goods" exact component={Goods} />
          <Route path="/goods/:goodsId" exact component={GoodsDetail} />
          <Route path="/order" exact component={Order} />
          <Route path="/user/:userId" exact component={User} />
          <Route path="/administer" exact component={Administer} />
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
        </Container>
        <Footer />
      </HashRouter>
    );
  }
}

export default App;
