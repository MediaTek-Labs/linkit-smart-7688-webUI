var Promise = require('bluebird');
var request = require('superagent');
var id = 1;
var ubusStatus = require('./ubusStatus');
var rpcAPI = {
  request: function(config) {

    return new Promise((resolve, reject) => {
      request
      .post('/ubus')
      .send(config)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        console.log(res);
        // return res.ok ? resolve(res) : reject(err);
        if (!res.ok) {
          return reject('Connection failed');
        }

        if (res.body.error) {
          return reject(res.body.error.message);
        }

        if (!res.body.result || res.body.result[0] != 0) {
          return reject(ubusStatus[res.body.result[0]]);
        } else {
          return resolve(res);
        }
      });
    });
  },

  // ====== login start ========
  login: function(userId, password) {

    var config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        '00000000000000000000000000000000',
        'session',
        'login',
        {
          username: userId,
          password: password
        }
      ]
    };

    return this.request(config);

  },

  grantCode: function(session) {

    var config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'session',
        'grant',
        {
          scope: 'uci',
          objects: [['*', 'read'], ['*', 'write']]
        }
    ]};

    return this.request(config);

  },
  // ====== login end ========
  selectWifi: function(section, ssid, key, enc, session) {

    var config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'uci',
        'set',
        {
          config: 'wireless',
          section: section,
          values: {
            ssid: ssid,
            key: key,
            encryption: enc
          }
        }
      ]
    };

    return this.request(config);

  },

  loadNetstate: function(iface, session) {

    var config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'network.interface',
        'status',
        {
          interface: iface
        }
      ]
    };

    return this.request(config);

  },

  loadNetwork: function(session) {
    var config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [session, 'uci', 'get', { config: 'network' }]
    };

    return this.request(config);

  },

  loadSystem: function(session) {

    var config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'uci',
        'get',
        {
          config: 'system',
          type: 'system'
        }
      ]
    };

    return this.request(config);

  },

  loadWifi: function(session) {

    var config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [ session, 'uci', 'get', { config: 'wireless' }]
    };

    return this.request(config);
  },

  applyConfig: function(session) {

    var config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'uci',
        'apply',
        { commit: true }
      ]
    };

    return this.request(config);

  },

  reloadConfig: function(session) {

    var config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'uci',
        'reload_config',
        { commit: true }
      ]
    };

    return this.request(config);

  }

};

export default rpcAPI;
