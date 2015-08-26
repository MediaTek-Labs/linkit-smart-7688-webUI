import React from 'react';
import Radium from 'radium';

import mui from 'material-ui';

let {
  TextField,
  Card,
  FlatButton,
  RaisedButton
} = mui;

var ThemeManager = new mui.Styles.ThemeManager();

@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}

    var info = JSON.parse(localStorage.getItem('info'))
    console.log(info)
    if (this.props.boardInfo) {
      this.state.deviceName = this.props.boardInfo.system[Object.keys(this.props.boardInfo.system)[0]].hostname
      this.state.macaddr = this.props.boardInfo.network.lan.macaddr;
      this.state.currentIp = this.props.boardInfo.lan['ipv4-address'][0].address
      this.state.user = info.user;
      this.state.password = info.password;
      this.state.bootLoaderVersion = '';
      this.state.firmwareVersion = '';

    }
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  render() {
    return (
      <div>
        <Card style={{ paddingRight: '20px', paddingLeft: '20px', paddingTop: '20px' }}>
          <h3 style={styles.h3}>Platform information</h3>

          <TextField
            hintText="Device name"
            style={{width: '100%'}}
            disabled={true}
            defaultValue={this.state.deviceName}
            floatingLabelText="Device name" />
          <TextField
            hintText="Mac address"
            disabled={true}
            style={{width: '100%'}}
            defaultValue={this.state.macaddr}
            floatingLabelText="Mac address" />
          <TextField
            hintText="Current IP address"
            style={{width: '100%'}}
            disabled={true}
            defaultValue={this.state.currentIp}
            floatingLabelText="Current IP address" />

          <h3 style={styles.h3Top}>Account information</h3>

          <TextField
            hintText="Account"
            style={{width: '100%'}}
            disabled={true}
            defaultValue={this.state.user}
            floatingLabelText="Account" />
          <TextField
            hintText="Password"
            disabled={true}
            style={{width: '100%'}}
            defaultValue={this.state.password}
            type="password"
            floatingLabelText="Password" />
          <RaisedButton
            linkButton={true}
            secondary={true}
            label="Configure"
            style={{width: '100%', textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
          </RaisedButton>

          <h3 style={styles.h3}>Software information</h3>

          <TextField
            hintText="Boot loader version"
            disabled={true}
            style={{width: '100%'}}
            defaultValue="Boot loader version"
            floatingLabelText="Boot loader version" />
          <TextField
            hintText="Firmware version"
            style={{width: '100%'}}
            disabled={true}
            defaultValue="Firmware version"
            floatingLabelText="Firmware version" />
          <RaisedButton
            linkButton={true}
            secondary={true}
            label="Upgrade firmware"
            style={{width: '100%', textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
          </RaisedButton>

          <h3 style={styles.h3}>Factory reset</h3>
          <p>Reset the device to its factory default settings.</p>
          <b>Important: This action will remove all your data and settings in the device.</b>
          <RaisedButton
            linkButton={true}
            secondary={true}
            label="Reset"
            style={{width: '100%', textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
          </RaisedButton>

        </Card>
      </div>
    )
  }

}


var styles = {
  h3: {
    marginBottom: '0px',
    marginTop:'0px',
  },
  h3Top: {
    marginTop:'20px',
    marginBottom: '0px'
  }
}
loginComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};


export default loginComponent;
