require('../css/main.css');

import React from 'react';
import AppConstants from './constants/appConstants.js';
const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

/* component */
import Login from './components/login.jsx';
import Content from './components/content.jsx';
import Header from './components/header.jsx';
import Resetpassword from './components/resetpassword.jsx';

/* store */
import AppStore from './stores/appStore.js';

function appState() {
  return AppStore.init();
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this._onChange = ::this._onChange;
  }
  componentDidMount() {
    AppStore.addChangeListener(this._onChange);
  }
  componentWillUnmount() {
    AppStore.removeChangeListener(this._onChange);
  }
  getInitialState() {
    return appState();
  }
  render() {
    let elem = '';
    switch (this.state.APP_PAGE) {
    case AppConstants.FIRSTLOGIN:
      elem = <Resetpassword { ... this.state }/>;
      break;
    case AppConstants.LOGIN:
      elem = <Login { ... this.state }/>;
      break;
    case AppConstants.CONTENT:
      elem = (
        <div>
          <Header { ... this.state } />
          <Content { ... this.state } />
        </div>
      );
      break;
    default:
      break;
    }
    return (
      <div>
        {elem}
      </div>
    );
  }
  _onChange() {
    this.setState(appState());
  }
}

React.render(
  <App />,
  document.getElementById('app')
);

