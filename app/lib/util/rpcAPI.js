var Promise = require('bluebird');

var rpcAPI = {
  request: function(config) {

    return new Promise((resolve, reject) => {
      request
      .post('/ubus')
      .send(config)
      .set('Accept', 'application/json')
      .end(function(err, res) {
        return res.ok ? resolve(res) : reject(err);
      });
    });

  },

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
