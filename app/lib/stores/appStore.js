var AppDispatcher  = require('../dispatcher/appDispatcher');
var EventEmitter   = require('events').EventEmitter;
var assign         = require('object-assign');
var AppConstants  = require('../constants/appConstants');
var AppActions     = require('../actions/appActions');
var CHANGE_EVENT   = 'change';
import rpc from '../util/rpcAPI';

let APP_PAGE       = {};
window.session = localStorage.getItem('session') || null;

if(window.session) {
  rpc.grantCode(window.session)
  .then(function() {
    return AppActions.initialFetchData(window.session)
  })
  .catch(function(err) {
    window.localStorage.removeItem('session');
    window.localStorage.removeItem('info');
    return AppDispatcher.dispatch({
      APP_PAGE: 'LOGIN',
      successMsg: null,
      errorMsg: 'Timeout'
    });
  });
} else {
  rpc.login('root', '')
  .then(function(data) {
    var session = data.body.result[1].ubus_rpc_session;
    window.session = session;
    return AppDispatcher.dispatch({
      APP_PAGE: 'FIRSTLOGIN',
      successMsg: null,
      errorMsg: null
    });
  })
  .catch(function(err) {
    if (err === 'Connection failed') {
      return AppDispatcher.dispatch({
        APP_PAGE: 'LOGIN',
        successMsg: null,
        errorMsg: 'Waiting'
      });
    } else if (err === 'Permission denied') {
      return AppDispatcher.dispatch({
        APP_PAGE: 'LOGIN',
        successMsg: null,
        errorMsg: null
      });
    }

    return ;
  })
}

// APP_PAGE.APP_PAGE = 'LOGIN';
// APP_PAGE.errorMsg = AppActions.getQuery('errorMsg') || null;
// APP_PAGE.successMsg = AppActions.getQuery('successMsg') || null;

var appStore = assign({}, EventEmitter.prototype, {

  init: function() {
    return APP_PAGE;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

});

AppDispatcher.register(function(action) {

  APP_PAGE.errorMsg = action.errorMsg || null;
  APP_PAGE.successMsg = action.successMsg || null;
  APP_PAGE.boardInfo = action.boardInfo || null;

  switch (action.APP_PAGE) {
    case AppConstants.FIRSTLOGIN:
      APP_PAGE.APP_PAGE = AppConstants.FIRSTLOGIN;
      appStore.emitChange();
      break;
    case AppConstants.LOGIN:
      APP_PAGE.APP_PAGE = AppConstants.LOGIN;
      appStore.emitChange();
      break;
    case AppConstants.CONTENT:
      APP_PAGE.APP_PAGE = AppConstants.CONTENT;
      appStore.emitChange();
      break;
    default:
  }

});

module.exports = appStore;
