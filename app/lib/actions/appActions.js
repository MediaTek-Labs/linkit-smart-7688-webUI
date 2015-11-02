import promise from 'bluebird';
import rpc from '../util/rpcAPI';
import AppDispatcher from '../dispatcher/appDispatcher';
let isLocalStorageNameSupported = false;

(() => {
  const testKey = 'test';
  const storage = window.sessionStorage;
  try {
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);
    isLocalStorageNameSupported = true;
  } catch (error) {
    window.memoryStorage = {};
    isLocalStorageNameSupported = false;
  }
})();

const appActions = {
  isLocalStorageNameSupported: isLocalStorageNameSupported,

  commitAndReboot: (session) => {
    return rpc.commitWifi(session)
    .then(() => {
      return rpc.reboot(session);
    })
    .catch(() => {
      return rpc.reboot(session);
    });
  },

  loadModel: (session) => {
    return rpc.loadModel(session);
  },

  setWifi: (section, ssid, key, session) => {
    let disabled = 1;
    let mode = 'ap';
    if (section === 'station') {
      mode = 'sta';
      disabled = 0;
    }
    return rpc.changeWifiMode(disabled, session)
    .then(() => {
      return rpc.setWifi(mode, ssid, key, session);
    });
  },
  scanWifi: (session) => {
    return rpc.scanWifi(session);
  },
  resetHostName: (hostname, session) => {
    return rpc.resetHostName(hostname, session);
  },
  resetPassword: (user, password) => {
    return rpc.resetPassword(user, password, window.session);
  },
  loadNetwork: (session) => {
    return rpc.loadNetwork(session);
  },
  loadNetstate: (session) => {
    return rpc.loadNetstate(session);
  },
  loadSystem: (session) => {
    return rpc.loadSystem(session);
  },
  initialFetchData: (session) => {
    return promise.delay(10).then(() => {
      return [
        rpc.loadSystem(session),
        rpc.loadWifi(session),
        rpc.loadNetwork(session),
        rpc.loadNetstate('lan', session),
        rpc.loadNetstate('wan', session),
      ];
    })
    .spread((system, wifi, network, lan, wan) => {
      const boardInfo = {};
      boardInfo.system = system.body.result[1].values;
      boardInfo.wifi = wifi.body.result[1].values;
      boardInfo.network = network.body.result[1].values;
      boardInfo.lan = lan.body.result[1];
      boardInfo.wan = wan.body.result[1];
      return boardInfo;
    })
    .then((boardInfo) => {
      return AppDispatcher.dispatch({
        APP_PAGE: 'CONTENT',
        boardInfo: boardInfo,
        successMsg: null,
        errorMsg: null,
      });
    });
  },

  login: function(user, password) {
    const this$ = this;
    return rpc.login(user, password)
    .then((data) => {
      const session = data.body.result[1].ubus_rpc_session;
      return session;
    })
    .then((session) => {
      window.session = session;
      if (this$.isLocalStorageNameSupported) {
        window.localStorage.info = JSON.stringify({
          user: user,
          password: password,
        });
        window.localStorage.session = session;
      } else {
        window.memoryStorage.info = JSON.stringify({
          user: user,
          password: password,
        });
        window.memoryStorage.session = session;
      }

      return rpc.grantCode(session);
    })
    .then(() => {
      return this$.initialFetchData(window.session);
    })
    .catch((err) => {
      window.session = '';

      if (this$.isLocalStorageNameSupported) {
        delete window.localStorage.session;
        delete window.localStorage.info;
      } else {
        delete window.memoryStorage.session;
        delete window.memoryStorage.info;
      }

      if (err === 'Connection failed') {
        return AppDispatcher.dispatch({
          APP_PAGE: 'LOGIN',
          successMsg: null,
          errorMsg: 'Waiting',
        });
      }

      alert(err);
    });
  },

  resetFactory: (session) => {
    return rpc.resetFactory(session);
  },

  checkFirmware: (session) => {
    return rpc.checkFirmware(session);
  },

  activeFirmware: (session) => {
    return rpc.activeFirmware(session);
  },

  uploadFirmware: (file, session) => {
    return rpc.uploadFirmware(file, session);
  },

  getQuery: (name) => {
    let match;
    const pl = /\+/g; /* Regex for replacing addition symbol with a space */
    const search = /([^&=]+)=?([^&]*)/g;
    const query = window.location.search.substring(1);
    const decode = (s) => {
      return decodeURIComponent(s.replace(pl, ' '));
    };

    const urlParams = {};
    while (match = search.exec(query)) {
      urlParams[decode(match[1])] = decode(match[2]);
    }

    return urlParams[name];
  },
};

export default appActions;
