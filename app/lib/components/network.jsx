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
  SelectField,
  Dialog,
  ListItem
} = mui;

var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: false,
      errorMsgTitle: null,
      errorMsg: null
    };

    this.state.wifiList = [{
      payload:0, text: __('Choose the Wi-Fi network.')
    }];

    this.state.apContent = {
      ssid: this.props.boardInfo.wifi.ap.ssid || '',
      key: this.props.boardInfo.wifi.ap.key || ''
    };
    this.state.selectValue = 0;
    this.state.stationContent = {
      ssid: this.props.boardInfo.wifi.sta.ssid || '',
      key: this.props.boardInfo.wifi.sta.key || ''
    };

    if (this.props.boardInfo.wifi.sta.disabled === "1") {
      this.state.mode = 'ap';

    } else {
      this.state.mode = 'station';
    }
    this._scanWifi = this._scanWifi.bind(this);
    this._onRadioButtonClick = this._onRadioButtonClick.bind(this);
    this._handleSelectValueChange = this._handleSelectValueChange.bind(this);
    this._handleSettingMode = this._handleSettingMode.bind(this);
    this.selectWifiList = false;
    this._returnToIndex = this._returnToIndex.bind(this);
    this._cancelErrorMsgDialog = this._cancelErrorMsgDialog.bind(this);
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
      for(var i = 0; i < data.body.result[1].results.length; i++ ){
        data.body.result[1].results[i].payload = i+1;
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

  _returnToIndex() {
    window.localStorage.removeItem('session');
    window.localStorage.removeItem('info');
    return AppDispatcher.dispatch({
      APP_PAGE: 'LOGIN',
      successMsg: null,
      errorMsg: null
    });
  }

  _handleSelectValueChange(name, e) {
    let change = {};
    change[name] = e.target.value;

    change['stationContent'] = {};
    change['stationContent'].key = '';
    change['stationContent'].ssid = this.state.wifiList[e.target.value-1].ssid;
    this.setState(change);
  }

  _handleSettingMode() {
    var _this = this;
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
      return AppDispatcher.dispatch({
        APP_PAGE: 'LOGIN',
        successMsg: __('Configuration saved. You can sign in to the console after your device has restarted.'),
        errorMsg: null
      });
    })
    .catch(function(err) {
      if (err === 'Access denied') {
        _this.setState({ errorMsgTitle: __('Access denied'), errorMsg: __('Your token was expired, please sign in again.') });
        return _this.refs.errorMsg.show();
      }
      alert('[' + err + '] Please try again!');
    })
  }

  _cancelErrorMsgDialog() {
    this.refs.errorDialog.dismiss();
    this._returnToIndex();
  }
  
  render() {
    let errMsgActions = [
      <FlatButton
        label={__("SIGN IN")}
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelErrorMsgDialog }
        hoverColor="none" />
    ]
    var elem;
    switch (this.state.mode) {
      case 'ap':
        elem =
          <div>
            <TextField
            hintText={__("Input your SSID")}
            type="text"
            value={ this.state.apContent.ssid }
            style={{ width: '100%' }}
            onChange={
              (e)=>{
                this.setState({
                  apContent: {
                    ssid: e.target.value,
                    key: this.state.apContent.key
                  }
                })
              }
            }
            underlineFocusStyle={{ borderColor: Colors.amber700 }}
            floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
            floatingLabelText={
              <div>
                { __("Network name") } <b style={{ color: 'red' }}>*</b>
              </div>
            } />
            <TextField
              hintText={__("Please enter your password")}
              type="password"
              underlineFocusStyle={{ borderColor: Colors.amber700 }}
              floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
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
              floatingLabelText={__("Password")} />
          </div>
        break;
      case 'station':
        elem =
          <div>
            <SelectField
              style={{ width: '100%', maxWidth: '512px', zIndex: '99', position: 'absolute' }}
              multiLine={ true }
              underlineStyle={{ maxHeight:'100px', overflow: 'hidden' }}
              menuItemStyle={{  maxHeight:'100px' }}
              floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
              underlineFocusStyle={{ borderColor: Colors.amber700 }}
              floatingLabelText={
                <div>
                  { __("Detected Wi-Fi network") } <b style={{ color: 'red' }}>*</b>
                </div>
              }
              onChange={ this._handleSelectValueChange.bind(null, 'selectValue') }
              value={ Number(this.state.selectValue) }
              menuItems={ this.state.wifiList } />
            <RaisedButton style={{ marginTop: '75px' }} label={__("Refresh")} onTouchTap={ this._scanWifi }/>
            <br />
            <TextField
              style={{ width: '100%' }}
              value={ this.state.stationContent.key }
              hintText={__("Input your Password")}
              floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
              underlineFocusStyle={{ borderColor: Colors.amber700 }}
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
              floatingLabelText={__("Password")} />
          </div>
        break;
    }
    return (
      <div>
        <Card>
          <Dialog
            title={this.state.errorMsgTitle}
            actions={ errMsgActions }
            actionFocus="submit"
            ref="errorDialog"
            modal={ this.state.modal }>
            <p style={{ color: '#999A94', marginTop: '-20px' }}>{ this.state.errorMsg }</p>
          </Dialog>
          <div style={ styles.content }>
            <h3>{__('Network setting')}</h3>
            <RadioButtonGroup name="shipSpeed" defaultSelected={ this.state.mode } style={{ display: 'flex', paddingTop: '20px' }} >
              <RadioButton
                value="ap"
                style={{
                  color: Colors.amber700, 
                  marginBottom: 16, 
                  width: '150px'
                }}
                label={__("AP mode")}
                onTouchTap={() => this._onRadioButtonClick('ap')}/>
              <RadioButton
                value="station"
                label={__("Station mode")}
                onTouchTap={() => this._onRadioButtonClick('station')}
                style={{
                  color: Colors.amber700, 
                  marginBottom: 16, 
                  width: '170px'
                }}/>
            </RadioButtonGroup>
            { elem }
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent:'space-between'
            }}>
              <RaisedButton
                linkButton={true}
                label={__("Cancel")}
                style={{ 
                  width: '236px', 
                  flexGrow:1, 
                  textAlign: 'center', 
                  marginTop: '20px', 
                  marginBottom: '20px', 
                  marginRight: '10px'
                }}
                backgroundColor="#EDEDED"
                labelColor="#999A94"
              >              
              </RaisedButton>
              <RaisedButton
                linkButton={true}
                secondary={true}
                label={__("Configure & Restart")}
                backgroundColor={ Colors.amber700 }
                onTouchTap={ this._handleSettingMode }
                style={{ 
                  width: '236px', 
                  flexGrow: 1, 
                  textAlign: 'center', 
                  marginTop: '20px', 
                  marginBottom: '20px', 
                  marginLeft: '10px'
                }}
              > 
              </RaisedButton>
            </div>
          </div>
        </Card>
      </div>
    )
  }

}

loginComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};

var styles = {

  content: {
    paddingRight: '128px', 
    paddingLeft: '128px',
    '@media (max-width: 760px)': {
      paddingRight: '20px', 
      paddingLeft: '20px',
    }
  }
}

export default loginComponent;
