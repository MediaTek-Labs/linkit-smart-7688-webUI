import React from 'react';
import Radium from 'radium';
import mui from 'material-ui';

let {
  TextField,
  Card,
  FlatButton,
  RadioButtonGroup,
  RadioButton,
  DropDownMenu,
  RaisedButton,
  FontIcon,
  SelectField
} = mui;
var ThemeManager = new mui.Styles.ThemeManager();

@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mode: 'ap'
    }
    this._onRadioButtonClick = this._onRadioButtonClick.bind(this);
    this._handleSelectValueChange = this._handleSelectValueChange.bind(this);
  }

  componentDidMount() {
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _onRadioButtonClick(mode) {
    this.setState({ mode: mode });
  }

  _handleSelectValueChange(name, e) {
    let change = {};
    change[name] = e.target.value;
    this.setState(change);
  }

  render() {
    let menuItems = [
       { payload: '1', text: 'Never' },
       { payload: '2', text: 'Every Night' },
       { payload: '3', text: 'Weeknights' },
       { payload: '4', text: 'Weekends' },
       { payload: '5', text: 'Weekly' },
    ];
    var elem;
    switch (this.state.mode) {
      case 'ap':
        elem =
          <div>
            <TextField
            hintText="Input your SSID"
            type="text"
            style={{ width: '100%' }}
            floatingLabelText="Network name" />
            <TextField
              hintText="Input your password"
              type="password"
              style={{ width: '100%' }}
              floatingLabelText="Password" />
          </div>
        break;
      case 'station':
        elem =
          <div>
            <SelectField
            value={this.state.selectValue}
            style={{width: '100%'}}
            onChange={this._handleSelectValueChange.bind(null, 'selectValue')}
            hintText="Hint Text"
            menuItems={menuItems} />
            <RaisedButton label="Refresh" />
            <br />
            <TextField
            style={{ width: '100%' }}
            hintText="Input your Password"
            type="password"
            floatingLabelText="Password" />
          </div>
        break;
    }
    return (
      <div>
        <Card style={{ paddingRight: '20px', paddingLeft: '20px' }}>
          <h3>Network setting</h3>
          <h4>Network mode</h4>
          <RadioButtonGroup name="shipSpeed" defaultSelected={this.state.mode}>
            <RadioButton
              value="ap"
              label="AP mode"
              onClick={() => this._onRadioButtonClick('ap')}
              style={{marginBottom:16}} />
            <RadioButton
              value="station"
              label="Station mode"
              onClick={() => this._onRadioButtonClick('station')}
              style={{marginBottom:16}}/>
          </RadioButtonGroup>
          { elem }
          <RaisedButton
            linkButton={true}
            label="Discard"
            onClick={this._handleLogin}
            style={{width: '50%', textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
          </RaisedButton>
          <RaisedButton
            linkButton={true}
            secondary={true}
            label="Configure & Restart"
            onClick={this._handleLogin}
            style={{width: '50%', textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
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
