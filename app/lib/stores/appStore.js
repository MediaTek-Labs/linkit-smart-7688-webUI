var AppDispatcher  = require('../dispatcher/appDispatcher');
var EventEmitter   = require('events').EventEmitter;
var assign         = require('object-assign');
var PageConstants  = require('../constants/appConstants');
var AppActions     = require('../actions/appActions');
var CHANGE_EVENT   = 'change';

let APP_PAGE       = {};

// let params = window.location.pathname.split(/\//g);

// if (/\/(\w+\-)+\w+/g.test(window.location.pathname)) {

//   var router = `/${params[1]}/${params[3]}`;

// } else {

//   if (params.length === 4) {
//     var router = `/${params[1]}/${params[3]}`;
//   } else {
//     var router = `/${params[1]}/${params[2]}`;
//   }

// }

// if (AppActions.getQuery('code')) {
//   if (/mcs/.test(document.location.host) && /io/.test(document.location.host)) {
//     var redirectUrl = document.location.host.replace('mcs.', 'api.');
//     document.location.href = '//' + redirectUrl + '/oauth/login?code=' + AppActions.getQuery('code');
//   }

//   AppActions
//   .signInWithLabs(AppActions.getQuery('code'));

// }

// switch (router){
//   case '/oauth/signup':
//     APP_PAGE.APP_PAGE = 'SIGNUP';
//     break;
//   case '/oauth/login':
//     APP_PAGE.APP_PAGE = 'LOGIN';
//     break;
//   case '/oauth/waiting':
//     APP_PAGE.APP_PAGE = 'WAITING';
//     break;
//   case '/oauth/forgetpassword':
//     APP_PAGE.APP_PAGE = 'FORGETPASSWORD';
//     break;
//   case '/oauth/resetpassword':
//     APP_PAGE.APP_PAGE = 'RESETPASSWORD';
//     break;
//   case '/oauth/verify':
//     APP_PAGE.APP_PAGE = 'VERIFY';
//     break;
// }

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

  // APP_PAGE.errorMsg = action.errorMsg;
  // APP_PAGE.successMsg = action.successMsg;

  // switch (action.APP_PAGE) {
  //   case PageConstants.LOGIN:
  //     APP_PAGE.APP_PAGE = PageConstants.LOGIN;
  //     appStore.emitChange();
  //     break;
  //   case PageConstants.SIGNUP:
  //     APP_PAGE.APP_PAGE = PageConstants.SIGNUP;
  //     appStore.emitChange();
  //     break;
  //   case PageConstants.FORGETPASSWORD:
  //     APP_PAGE.APP_PAGE = PageConstants.FORGETPASSWORD;
  //     appStore.emitChange();
  //     break;
  //   case PageConstants.WAITING:
  //     APP_PAGE.APP_PAGE = PageConstants.WAITING;
  //     appStore.emitChange();
  //     break;
  //   case PageConstants.TERMSOFUSE:
  //     APP_PAGE.APP_PAGE = PageConstants.TERMSOFUSE;
  //     appStore.emitChange();
  //     break;
  //   case PageConstants.VERIFY:
  //     APP_PAGE.APP_PAGE = PageConstants.VERIFY;
  //     appStore.emitChange();
  //     break;
  //   case PageConstants.RESETPASSWORD:
  //     APP_PAGE.APP_PAGE = PageConstants.RESETPASSWORD;
  //     appStore.emitChange();
  //     break;
  //   default:
  // }

});

module.exports = appStore;
