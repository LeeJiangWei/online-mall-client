import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { getStatus } from '../actions';

import 'semantic-ui-css/semantic.min.css';
import { Container } from 'semantic-ui-react';

import Header from './Header';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

import Goods from './goods';
import GoodsDetail from './goods/GoodsDetail';
import EditGoods from './goods/EditGoods';
import Order from './order';
import User from './user';
import Administer from './administer';
import Login from './login';
import Register from './register';

class App extends React.Component {
  componentDidMount = () => {
    this.props.getStatus();
  };

  render() {
    // Global routes settings
    return (
      <HashRouter>
        <ScrollToTop>
          <Container style={{ marginTop: '5em', minHeight: '80vh' }}>
            <Route path="/" component={Header} />
            <Switch>
              <Route path="/" exact component={Goods} />
              <Route path="/goods" exact component={Goods} />
              <Route path="/goods/new" exact component={EditGoods} />
              <Route path="/goods/:goodsId" exact component={GoodsDetail} />
              <Route path="/goods/edit/:goodsId" exact component={EditGoods} />
              <Route path="/order" exact component={Order} />
              <Route path="/user/:userId" exact component={User} />
              <Route path="/administer" exact component={Administer} />
              <Route path="/login" exact component={Login} />
              <Route path="/register" exact component={Register} />
            </Switch>
          </Container>
          <Footer />
        </ScrollToTop>
      </HashRouter>
    );
  }
}

export default connect(
  null,
  { getStatus }
)(App);
