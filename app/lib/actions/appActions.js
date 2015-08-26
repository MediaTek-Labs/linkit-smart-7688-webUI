import superagent from 'superagent';
import promise from 'bluebird';
import rpc from '../util/rpcAPI';
var AppDispatcher = require('../dispatcher/appDispatcher');

var appActions = {

  setWifi: function(section, ssid, key) {
    return rpc.setWifi(session, ssid, key)
  },

  scanWifi: function(session) {
    return rpc.scanWifi(session);
  },

  resetPassword: function(password, session) {
    return rpc.resetPassword(password, window.session);
  },

  loadNetwork: function(session) {
    return rpc.loadNetwork(session);
  },

  loadNetstate: function(session) {
    return rpc.loadNetstate(session);
  },

  loadSystem: function(session) {
    return rpc.loadSystem(session);
  },

  initialFetchData: function(session) {
    return promise.delay(10).then(function() {
      return [
        rpc.loadSystem(session),
        rpc.loadWifi(session),
        rpc.loadNetwork(session),
        rpc.loadNetstate('lan', session),
        rpc.loadNetstate('wan', session)
      ]
    })
    .spread(function(system, wifi, network, lan, wan) {
      var boardInfo = {};
      boardInfo.system = system.body.result[1].values;
      boardInfo.wifi = wifi.body.result[1].values;
      boardInfo.network = network.body.result[1].values;
      boardInfo.lan = lan.body.result[1];
      boardInfo.wan = wan.body.result[1];
      return boardInfo;
    })
    .then(function(boardInfo) {
      console.log(boardInfo)
      return AppDispatcher.dispatch({
        APP_PAGE: 'CONTENT',
        boardInfo: boardInfo,
        successMsg: null,
        errorMsg: null
      });
    })
  },

  login: function(user, password) {
    var _this = this;
    return rpc.login(user, password)
    .then(function(data) {
      var session = data.body.result[1].ubus_rpc_session;
      return session;
    })
    .then(function(session) {
      window.session = session;
      window.localStorage.setItem('session', session);
      return rpc.grantCode(session);
    })
    .then(function(data) {
      return _this.initialFetchData(window.session);
    })
    .catch(function(err) {
      window.session = ''
      window.localStorage.removeItem('session');
      return AppDispatcher.dispatch({
        APP_PAGE: 'CONTENT',
        successMsg: null,
        errorMsg: '[' + err + '] failed to grant object permissions'
      });
    })
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
