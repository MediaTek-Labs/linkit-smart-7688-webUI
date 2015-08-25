import React from 'react';
import AppConstants from './constants/appConstants.js';

//component

//store
import AppStore from './stores/appStore.js';

function appState() {
  return AppStore.init();
}

const App = React.createClass({

  componentDidMount: function() {
    AppStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(appState());
  },

  getInitialState: function() {
    return appState();
  },

  render: function() {
    return (
      <div>
        123
      </div>
    );
  }

});

React.render(
  <App />,
  document.getElementById('app')
);

