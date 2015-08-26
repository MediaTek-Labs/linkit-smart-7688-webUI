import React from 'react';
import Radium from 'radium';

import mui from 'material-ui';
let {TextField, Card, FlatButton, RadioButtonGroup, RadioButton, DropDownMenu} = mui;
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
    let menuItems = [
       { payload: '1', text: 'Never' },
       { payload: '2', text: 'Every Night' },
       { payload: '3', text: 'Weeknights' },
       { payload: '4', text: 'Weekends' },
       { payload: '5', text: 'Weekly' },
    ];
    return (
      <div>
        <Card>
          <h3>Network setting</h3>
          <h4>Network mode</h4>
          <RadioButtonGroup name="shipSpeed" defaultSelected="not_light">
          <RadioButton
            value="light"
            label="AP mode"
            style={{marginBottom:16}} />
          <RadioButton
            value="not_light"
            label="Station mode"
            style={{marginBottom:16}}/>
          </RadioButtonGroup>
          <br />
          <DropDownMenu menuItems={menuItems} />
          <br />
          <TextField
          hintText="Input your Password"
          type="password"
          floatingLabelText="Password" />
          <br />
          <FlatButton label="Discard" />
          <FlatButton label="Configure & Restart" />

        </Card>
      </div>
    )
  }

}

loginComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};


export default loginComponent;
