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
    // this.state.wifi = []
  }

  componentDidMount() {
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  render() {
    return (
      <div>
        <Card style={{ paddingRight: '20px', paddingLeft: '20px' }}>
          <h3>System information</h3>
          <TextField
          hintText="Device name"
          style={{width: '100%'}}
          disabled={true}
          defaultValue="Device name"
          floatingLabelText="Device name" />
          <TextField
          hintText="Password"
          style={{width: '100%'}}
          disabled={true}
          defaultValue="Password"
          floatingLabelText="Password" />
          <TextField
          hintText="Mac address"
          disabled={true}
          style={{width: '100%'}}
          defaultValue="Mac address"
          floatingLabelText="Mac address" />
          <TextField
          hintText="Current IP address"
          style={{width: '100%'}}
          disabled={true}
          defaultValue="Current IP address"
          floatingLabelText="Current IP address" />
          <TextField
          hintText="Boot loader version"
          disabled={true}
          style={{width: '100%'}}
          defaultValue="Boot loader version"
          floatingLabelText="Boot loader version" />

          <RaisedButton
            linkButton={true}
            secondary={true}
            label="Configure"
            style={{width: '100%', textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
          </RaisedButton>
          <hr />

          <h3>Firmware</h3>
          <TextField
          hintText="Current firmware name"
          disabled={true}
          style={{width: '100%'}}
          defaultValue="Current firmware name"
          floatingLabelText="Current firmware name" />
          <TextField
          hintText="Firmware version"
          disabled={true}
          style={{width: '100%'}}
          defaultValue="Firmware version"
          floatingLabelText="Firmware version" />
          <TextField
          hintText="Firmware feature"
          disabled={true}
          style={{width: '100%'}}
          defaultValue="Firmware feature"
          floatingLabelText="Firmware feature" />
          <RaisedButton
            linkButton={true}
            secondary={true}
            label="Upgrade firmware"
            style={{width: '100%', textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
          </RaisedButton>

        </Card>
      </div>
    )
  }

}

loginComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};


export default loginComponent;
