import superagent from 'superagent';
import promise from 'bluebird';
import rpc from '../util/rpcAPI';
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
    return rpc.login(user, password);
  }
};

export default appActions;
