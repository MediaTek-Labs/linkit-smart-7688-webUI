import React from 'react';
import Radium from 'radium';
import mui from 'material-ui';
var AppActions     = require('../actions/appActions');
var AppDispatcher  = require('../dispatcher/appDispatcher');

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
var Colors = mui.Styles.Colors;

@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)

    this.state = {}
    this.state.wifiList = [];
    this.state.apContent = {
      ssid: this.props.boardInfo.wifi.ap.ssid || '',
      key: this.props.boardInfo.wifi.ap.key || ''
    };
    this.state.selectValue = 0
    this.state.stationContent = {
      ssid: this.props.boardInfo.wifi.sta.ssid || '',
      key: this.props.boardInfo.wifi.sta.key || ''
    };

    if (this.props.boardInfo.wifi.sta.disabled) {
      this.state.mode = 'ap';

    } else {
      this.state.mode = 'station';
    }
    this._scanWifi = this._scanWifi.bind(this);
    this._onRadioButtonClick = this._onRadioButtonClick.bind(this);
    this._handleSelectValueChange = this._handleSelectValueChange.bind(this);
    this._handleSettingMode = this._handleSettingMode.bind(this);
  }

  componentDidMount() {
    return this._scanWifi();
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _scanWifi() {
    var _this = this;
    return AppActions.scanWifi(window.session)
    .then(function(data) {
      var selectValue ;
      for(var i =0; i< data.body.result[1].results.length; i++ ){
        data.body.result[1].results[i].payload = i + 1;
        data.body.result[1].results[i].text = data.body.result[1].results[i].ssid + ' - ' + data.body.result[1].results[i].quality + ' %';
        // 抓現在版子上的 wifi ssid 是誰
        // =========
        if (_this.props.boardInfo.wifi.sta.ssid === data.body.result[1].results[i].ssid) {
          selectValue = i + 1;
        }
        // =========
      }
      return _this.setState({
        selectValue: selectValue,
        wifiList: data.body.result[1].results
      })
    })
  }

  _onRadioButtonClick(mode) {
    this.setState({ mode: mode });
  }

  _handleSelectValueChange(name, e) {
    let change = {};
    change[name] = e.target.value;
    console.log('===================')
    console.log(e.target.value);
    console.log('===================')

    // console.log(this.state.wifiList[e.target.value-1);
    change['stationContent'] = {};
    change['stationContent'].key = '';
    change['stationContent'].ssid = this.state.wifiList[e.target.value-1].ssid;
    this.setState(change);
  }

  _handleSettingMode() {
    return AppActions.setWifi(this.state.mode, this.state[ this.state.mode+'Content'].ssid, this.state[ this.state.mode+'Content'].key, window.session)
    .then(function() {
      return AppActions.commitAndReboot(window.session)
      .then(function(){
        return;
      })
      .catch(function(err) {
        if (err === 'no data') {
          return;
        } else {
          return err;
        }
      })
    })
    .then(function() {
      alert('Success!We will reboot now!')
      return AppDispatcher.dispatch({
        APP_PAGE: 'LOGIN',
        successMsg: null,
        errorMsg: null
      });
    })
    .catch(function(err) {
      alert('[' + err + '] Please try again!');
    })
  }

  render() {
    var elem;
    switch (this.state.mode) {
      case 'ap':
        elem =
          <div>
            <TextField
            hintText="Input your SSID"
            type="text"
            value={ this.state.apContent.ssid }
            style={{ width: '100%' }}
            floatingLabelText="Network name" />
            <TextField
              hintText="Input your password"
              type="password"
              value={ this.state.apContent.key }
              onChange={
                (e)=>{
                  this.setState({
                    apContent: {
                      ssid: this.state.apContent.ssid,
                      key: e.target.value
                    }
                  })
                }
              }
              style={{ width: '100%' }}
              floatingLabelText="Password" />
          </div>
        break;
      case 'station':
        elem =
          <div>
            <SelectField
              value={ this.state.selectValue }
              style={{ width: '100%' }}
              multiLine={true}
              underlineStyle={{maxHeight:'100px', overflow: 'hidden'}}
              menuItemStyle={{maxHeight:'100px'}}
              onChange={ this._handleSelectValueChange.bind(null, 'selectValue') }
              hintText="Detected wifi network"
              menuItems={ this.state.wifiList } />
            <RaisedButton label="Refresh" onClick={ this._scanWifi }/>
            <br />
            <TextField
              style={{ width: '100%' }}
              value={ this.state.stationContent.key }
              hintText="Input your Password"
              type="password"
              onChange={
                (e)=>{
                  this.setState({
                    stationContent: {
                      ssid: this.state.stationContent.ssid,
                      key: e.target.value
                    }
                  })
                }
              }
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
            label="Cancel"
            style={{width: '50%', textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
          </RaisedButton>
          <RaisedButton
            linkButton={true}
            secondary={true}
            label="Configure & Restart"
            backgroundColor={Colors.amber700}
            onClick={this._handleSettingMode}
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
