import superagent from 'superagent';
import promise from 'bluebird';
import rpc from '../util/rpcAPI';
var AppDispatcher = require('../dispatcher/appDispatcher');

var session = window.session;
var appActions = {
  wifiMode: function(mode, ssid, key) {

  },

  resetPassword: function(password) {
    return rpc.resetPassword(password, session);
  },

  loadNetwork: function() {
    return rpc.loadNetwork(session);
  },

  loadNetstate: function() {
    return rpc.loadNetstate(session);
  },

  loadSystem: function() {
    return rpc.loadSystem(session);
  },

  login: function(user, password) {
    // return rpc.login(user, password);
    return AppDispatcher.dispatch({
      APP_PAGE: 'CONTENT',
      // title: __('Resend completed!'),
      successMsg: null,
      errorMsg: null
    });
  },

  getQuery: function(name) {
    var match;
    var pl     = /\+/g; /* Regex for replacing addition symbol with a space */
    var search = /([^&=]+)=?([^&]*)/g;
    var query  = window.location.search.substring(1);
    var decode = function(s) {
      return decodeURIComponent(s.replace(pl, ' '));
    };

    var urlParams = {};
    while (match = search.exec(query)) {
      urlParams[decode(match[1])] = decode(match[2]);
    }

    return urlParams[name];
  }
};

export default appActions;
