import Promise from 'bluebird';
import request from 'superagent';
import ubusStatus from './ubusStatus';
let id = 1;
let RPCurl = '/ubus';

if (window.location.hostname === '127.0.0.1') {
  RPCurl = 'http://mylinkit.local/ubus';
}

const rpcAPI = {
  request: function(config) {
    return new Promise((resolve, reject) => {
      request
      .post(RPCurl)
      .send(config)
      .set('Accept', 'application/json')
      .end((err, res) => {
        // return res.ok ? resolve(res) : reject(err);
        if (!res) {
          return reject('Connection failed');
        }

        if (!res.ok) {
          return reject('Connection failed');
        }

        if (res.body && res.body.error) {
          return reject(res.body.error.message);
        }

        if (!res.body.result || res.body.result[0] !== 0) {
          return reject(ubusStatus[res.body.result[0]]);
        }
        return resolve(res);
      });
    });
  },

  // ====== login start ========
  login: function(userId, password) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        '00000000000000000000000000000000',
        'session',
        'login',
        {
          username: userId,
          password: password,
        },
      ],
    };
    return this.request(config);
  },

  loadModel: function(session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [ session, 'system', 'board', { dummy: 0 }],
    };

    return this.request(config);
  },

  grantCode: function(session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'session',
        'grant',
        {
          scope: 'uci',
          objects: [['*', 'read'], ['*', 'write']],
        },
      ],
    };
    return this.request(config);
  },
  // ====== login end ========
  changeWifiMode: function(disabled, session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [ session, 'uci', 'set',
        {
          config: 'wireless',
          section: 'sta',
          values: {
            disabled: disabled,
          },
        },
      ],
    };

    return this.request(config);
  },
  scanWifi: function(session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [session, 'iwinfo', 'scan', { device: 'ra0' }],
    };

    return this.request(config);
  },
  setWifi: function(section, ssid, key, session) {
    let enc = 'none';
    if (key.length > 1) {
      enc = 'psk2';
    }

    const config = {
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
            encryption: enc,
          },
        },
      ],
    };

    return this.request(config);
  },
  commitWifi: function(session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [session, 'uci', 'apply', { commit: true }]};

    return this.request(config);
  },
  reboot: function(session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [session, 'rpc-sys', 'reboot', { dummy: 0}],
    };

    return this.request(config);
  },
  resetPassword: function(user, password, session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'rpc-sys',
        'password_set',
        {
          user: user,
          password: password,
        },
      ],
    };

    return this.request(config);
  },
  loadNetstate: function(iface, session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'network.interface',
        'status',
        {
          interface: iface,
        },
      ],
    };

    return this.request(config);
  },
  loadNetwork: function(session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [session, 'uci', 'get', { config: 'network' }],
    };

    return this.request(config);
  },
  loadSystem: function(session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'uci',
        'get',
        {
          config: 'system',
          type: 'system',
        },
      ],
    };
    return this.request(config);
  },
  loadWifi: function(session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [session, 'uci', 'get', { config: 'wireless' }],
    };

    return this.request(config);
  },
  applyConfig: function(session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'uci',
        'apply',
        { commit: true },
      ],
    };

    return this.request(config);
  },
  activeFirmware: function(session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [session, 'rpc-sys', 'upgrade_start', { keep: 1}],
    };

    return this.request(config);
  },
  checkFirmware: function(session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [session, 'rpc-sys', 'upgrade_test', { dummy: 0}],
    };

    return this.request(config);
  },
  uploadFirmware: function(file, session) {
    const uploadUrl = RPCurl.replace('/ubus', '/cgi-bin/cgi-upload');
    return new Promise((resolve, reject) => {
      request
      .post(uploadUrl)
      .field('sessionid', session)
      .field('filemode', '0600')
      .field('filename', '/tmp/firmware.bin')
      .attach('filedata', file, file.name)
      .end((err, res) => {
        // return res.ok ? resolve(res) : reject(err);
        if (!res.ok) {
          return reject('Connection failed');
        }
        return resolve(res);
      });
    });
  },

  reloadConfig: function(session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'uci',
        'reload_config',
        { commit: true },
      ],
    };

    return this.request(config);
  },

  resetFactory: function(session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [session, 'rpc-sys', 'factory', { dummy: 0}],
    };

    return this.request(config);
  },

  resetHostName: function(hostname, session) {
    const config = {
      jsonrpc: '2.0',
      id: id++,
      method: 'call',
      params: [
        session,
        'uci',
        'set', {
          config: 'system',
          section: '@system[0]',
          values: { hostname: hostname },
        },
      ],
    };

    return this.request(config);
  },
};

export default rpcAPI;
