import React from 'react';
import Radium from 'radium';

import mui from 'material-ui';
let {TextField, Card, FlatButton} = mui;
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
        <Card>
          <h3>System information</h3>
          <TextField
          hintText="Device name"
          disabled={true}
          defaultValue="Device name"
          floatingLabelText="Device name" />
          <br />
          <TextField
          hintText="Password"
          disabled={true}
          defaultValue="Password"
          floatingLabelText="Password" />
          <br />
          <TextField
          hintText="Mac address"
          disabled={true}
          defaultValue="Mac address"
          floatingLabelText="Mac address" />
          <br />
          <TextField
          hintText="Current IP address"
          disabled={true}
          defaultValue="Current IP address"
          floatingLabelText="Current IP address" />
          <br />
          <TextField
          hintText="Boot loader version"
          disabled={true}
          defaultValue="Boot loader version"
          floatingLabelText="Boot loader version" />
          <br />
          <FlatButton label="Configure" />
          <hr />

          <h3>Firmware</h3>
          <TextField
          hintText="Current firmware name"
          disabled={true}
          defaultValue="Current firmware name"
          floatingLabelText="Current firmware name" />
          <br />
          <TextField
          hintText="Firmware version"
          disabled={true}
          defaultValue="Firmware version"
          floatingLabelText="Firmware version" />
          <br />
          <TextField
          hintText="Firmware feature"
          disabled={true}
          defaultValue="Firmware feature"
          floatingLabelText="Firmware feature" />
          <br />
          <FlatButton label="Upgrade firmware" />

        </Card>
      </div>
    )
  }

}

loginComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};


export default loginComponent;
