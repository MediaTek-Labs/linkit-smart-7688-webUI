import { default as React, PropTypes } from 'react';
import Radium from 'radium';
import mui from 'material-ui';
import AppActions from '../actions/appActions';
import AppDispatcher from '../dispatcher/appDispatcher';
import icon7688 from '../../img/7688.png';
import icon7688Duo from '../../img/7688_duo.png';

const {
  TextField,
  Card,
  FlatButton,
  RadioButtonGroup,
  RadioButton,
  RaisedButton,
  SelectField,
  Dialog,
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();
const Colors = mui.Styles.Colors;
const styles = {

  content: {
    paddingRight: '128px',
    paddingLeft: '128px',
    '@media (max-width: 760px)': {
      paddingRight: '20px',
      paddingLeft: '20px',
    },
  },

};


@Radium
export default class networkComponent extends React.Component {
  static propTypes = {
    errorMsg: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    successMsg: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    boardInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  }
  constructor(props) {
    super(props);

    this.state = {
      modal: true,
      errorMsgTitle: null,
      errorMsg: null,
    };

    this.state.wifiList = [{
      payload: 0,
      text: __('Choose the Wi-Fi network.'),
    }];
    if (this.props.boardInfo.wifi.ap.encryption === 'none') {
      this.state.apContent = {
        ssid: this.props.boardInfo.wifi.ap.ssid || '',
        key: '',
        encryption: false,
      };
    } else {
      this.state.apContent = {
        ssid: this.props.boardInfo.wifi.ap.ssid || '',
        key: this.props.boardInfo.wifi.ap.key || '',
        encryption: true,
      };
    }

    this.state.showPassword = false;
    this.state.notPassPassword = false;
    this.state.selectValue = 0;
    this.state.stationContent = {
      ssid: this.props.boardInfo.wifi.sta.ssid || '',
      key: this.props.boardInfo.wifi.sta.key || '',
      encryption: this.props.boardInfo.wifi.sta.encryption.enabled || false,
    };

    if (this.props.boardInfo.wifi.sta.disabled === '1') {
      this.state.mode = 'ap';
      if (this.state.apContent.key.length > 0 && this.state.apContent.key.length < 8 ) {
        this.state.notPassPassword = true;
      }
    } else {
      this.state.mode = 'station';
    }
    this._scanWifi = ::this._scanWifi;
    this._onRadioButtonClick = ::this._onRadioButtonClick;
    this._handleSelectValueChange = ::this._handleSelectValueChange;
    this._handleSettingMode = ::this._handleSettingMode;
    this.selectWifiList = false;
    this._returnToIndex = ::this._returnToIndex;
    this._cancelErrorMsgDialog = ::this._cancelErrorMsgDialog;
    this._cancelBoardMsgDialog = ::this._cancelBoardMsgDialog;
  }

  componentWillMount() {
    const this$ = this;

    ThemeManager.setComponentThemes({
      textField: {
        focusColor: Colors.amber700,
      },
      menuItem: {
        selectedTextColor: Colors.amber700,
      },
      radioButton: {
        backgroundColor: '#00a1de',
        checkedColor: '#00a1de',
      },
    });

    AppActions.loadModel(window.session)
    .then((data) => {
      return this$.setState({ boardModel: data.body.result[1].model });
    });
  }

  componentDidMount() {
    return this._scanWifi();
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  render() {
    let textType = 'password';
    let errorText;
    let boardImg = icon7688Duo;
    let showPasswordStyle = {
      width: '100%',
      marginBottom: '44px',
    };
    let elem;
    let stationPassword;

    if (this.state.showPassword) {
      textType = 'text';
    }
    if (this.state.notPassPassword) {
      errorText = (
        <div>
          <p style={{
            color: '#69BE28',
            textAlign: 'left',
            marginTop: '2px',
          }}>{ __('Please use at least 8 alphanumeric characters.') }</p>
        </div>
      );
      showPasswordStyle = {
        marginTop: '20px',
        width: '100%',
        marginBottom: '44px',
      };
    }

    const boardMsgActions = [
      <FlatButton
        label={ __('OK') }
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelBoardMsgDialog }
        hoverColor="none" />,
    ];

    const errMsgActions = [
      <FlatButton
        label={__('SIGN IN')}
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelErrorMsgDialog }
        hoverColor="none" />,
    ];

    if (this.state.stationContent.encryption) {
      stationPassword = (
        <div>
          <TextField
            style={{ width: '100%' }}
            value={ this.state.stationContent.key }
            hintText={__('Please enter your password')}
            floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
            underlineFocusStyle={{ borderColor: Colors.amber700 }}
            type={ textType }
            onChange={
              (e) => {
                this.setState({
                  stationContent: {
                    ssid: this.state.stationContent.ssid,
                    key: e.target.value,
                  },
                });
              }
            }
            floatingLabelText={__('Password')} />
          <a
            onTouchTap={
              () => {
                this.setState({
                  showPassword: !this.state.showPassword,
                });
              }
            }
            style={{
              textAlign: 'left',
              color: Colors.amber700,
              textDecoration: 'none',
              cursor: 'pointer',
              fontSize: '14px',
            }}>{ __('SHOW PASSWORD') }</a>
        </div>
      );
    }
    switch (this.state.mode) {
    case 'ap':
      elem = (
        <div>
          <TextField
          hintText={__('Input your SSID')}
          type="text"
          value={ this.state.apContent.ssid }
          style={{ width: '100%' }}
          onChange={
            (e) => {
              this.setState({
                apContent: {
                  ssid: e.target.value,
                  key: this.state.apContent.key,
                },
              });
            }
          }
          underlineFocusStyle={{ borderColor: Colors.amber700 }}
          floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
          floatingLabelText={
            <div>
              { __('Network name') } <b style={{ color: 'red' }}>*</b>
            </div>
          } />
          <TextField
            hintText={__('Please enter your password')}
            errorStyle={{ borderColor: Colors.amber700 }}
            errorText={ errorText }
            type={ textType }
            underlineFocusStyle={{ borderColor: Colors.amber700 }}
            floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
            value={ this.state.apContent.key }
            onChange={
              (e) => {
                if ( e.target.value.length > 0 && e.target.value.length < 8) {
                  this.setState({
                    apContent: {
                      ssid: this.state.apContent.ssid,
                      key: e.target.value,
                    },
                    notPassPassword: true,
                  });
                } else if (e.target.value.length === 0) {
                  this.setState({
                    apContent: {
                      ssid: this.state.apContent.ssid,
                      key: e.target.value,
                    },
                    notPassPassword: false,
                  });
                } else {
                  this.setState({
                    apContent: {
                      ssid: this.state.apContent.ssid,
                      key: e.target.value,
                    },
                    notPassPassword: false,
                  });
                }
              }
            }
            style={{ width: '100%' }}
            floatingLabelText={__('Password')} />
            <div style={ showPasswordStyle }>
            <a
              onTouchTap={
                () => {
                  this.setState({
                    showPassword: !this.state.showPassword,
                  });
                }
              }
              style={{
                textAlign: 'left',
                color: Colors.amber700,
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: '14px',
              }}>{ __('SHOW PASSWORD') }</a>
          </div>
        </div>
      );

      break;
    case 'station':
      elem = (
        <div>
          <SelectField
            style={{
              width: '100%',
              maxWidth: '512px',
              position: 'absolute',
            }}
            multiLine
            underlineStyle={{ maxHeight: '100px', overflow: 'hidden' }}
            menuItemStyle={{ maxHeight: '100px' }}
            floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
            underlineFocusStyle={{ borderColor: Colors.amber700 }}
            floatingLabelText={
              <div>
                { __('Detected Wi-Fi network') } <b style={{ color: 'red' }}>*</b>
              </div>
            }
            onChange={ this._handleSelectValueChange.bind(null, 'selectValue') }
            value={ Number(this.state.selectValue) }
            menuItems={ this.state.wifiList } />
          <RaisedButton style={{ marginTop: '75px' }} label={__('Refresh')} onTouchTap={ this._scanWifi } />
          <br />
          { stationPassword }
        </div>
      );
      break;
    default:
      break;
    }
    if (this.state.boardModel === 'MediaTek LinkIt Smart7688') {
      boardImg = icon7688;
    }

    return (
      <div>
        <Card>
          <Dialog
            title={__('Device Restarting. Please Wait…')}
            actionFocus="submit"
            actions={ boardMsgActions }
            ref="boardMsgDialog"
            modal={ this.state.modal }>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <p style={{
              fontSize: '16px',
              color: '#999A94',
              lineHeight: '18.54px',
              marginTop: '-15px',
            }}>{ __('See the Wi-Fi LED, it will light on steadily and start to blink or turn off afterwards. When the LED starts to blink or turn off, reload this webpage to sign in again.')}</p>
            <p style={{
              fontSize: '16px',
              color: '#999A94',
              lineHeight: '18.54px',
            }}>{ __('Note: Please make sure your host computer is in the ')} { this.state[ this.state.mode + 'Content'].ssid } {__('network. You can’t access this page if it’s in a different network.')}</p>
            <img src={ boardImg } style={{ width: '350px' }} />
            </div>
          </Dialog>
          <Dialog
            title={ this.state.errorMsgTitle }
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
                  width: '150px',
                }}
                label={__('AP mode')}
                onTouchTap={() => this._onRadioButtonClick('ap')}/>
              <RadioButton
                value="station"
                label={__('Station mode')}
                onTouchTap={() => this._onRadioButtonClick('station')}
                style={{
                  color: Colors.amber700,
                  marginBottom: 16,
                  width: '170px',
                }}/>
            </RadioButtonGroup>
            { elem }
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <RaisedButton
                linkButton
                label={__('Cancel')}
                style={{
                  width: '236px',
                  flexGrow: 1,
                  textAlign: 'center',
                  marginTop: '20px',
                  marginBottom: '20px',
                  marginRight: '10px',
                }}
                backgroundColor="#EDEDED"
                labelColor="#999A94" />
              <RaisedButton
                linkButton
                secondary
                label={__('Configure & Restart')}
                backgroundColor={ Colors.amber700 }
                onTouchTap={ this._handleSettingMode }
                style={{
                  width: '236px',
                  flexGrow: 1,
                  textAlign: 'center',
                  marginTop: '20px',
                  marginBottom: '20px',
                  marginLeft: '10px',
                }} />
            </div>
          </div>
        </Card>
      </div>
    );
  }
  _scanWifi() {
    const this$ = this;
    return AppActions.scanWifi(window.session)
    .then((data) => {
      let selectValue;
      const stationModeInfo = this$.state.stationContent;
      for (let i = 0; i < data.body.result[1].results.length; i++ ) {
        data.body.result[1].results[i].payload = i + 1;
        data.body.result[1].results[i].text = data.body.result[1].results[i].ssid + ' - ' + data.body.result[1].results[i].quality + ' %';

        // To know which wifi use this wifi ssid.
        if (this$.props.boardInfo.wifi.sta.ssid === data.body.result[1].results[i].ssid) {
          selectValue = i + 1;
          stationModeInfo.encryption = data.body.result[1].results[i].encryption.enabled;
        }
      }

      return this$.setState({
        selectValue: selectValue,
        stationContent: stationModeInfo,
        wifiList: data.body.result[1].results,
      });
    });
  }

  _onRadioButtonClick(mode) {
    if (mode === 'ap' && this.state.apContent.key.length > 0 && this.state.apContent.key.length < 8) {
      this.setState({ mode: mode, notPassPassword: true, showPassword: false });
    } else {
      this.setState({ mode: mode, notPassPassword: false, showPassword: false });
    }
  }

  _returnToIndex(successMsg, errorMsg) {
    if (successMsg) {
      this.refs.boardMsgDialog.show();
      this.setState({ boardSuccessMsg: successMsg });
    } else {
      window.localStorage.removeItem('session');
      window.localStorage.removeItem('info');
      return AppDispatcher.dispatch({
        APP_PAGE: 'LOGIN',
        successMsg: successMsg || null,
        errorMsg: errorMsg || null,
      });
    }
  }

  _handleSelectValueChange(name, e) {
    const change = {};
    change[name] = e.target.value;

    change.stationContent = {};
    change.stationContent.key = '';
    change.stationContent.ssid = this.state.wifiList[e.target.value - 1].ssid;
    change.stationContent.encryption = this.state.wifiList[e.target.value - 1].encryption.enabled;
    this.setState(change);
  }

  _handleSettingMode() {
    const this$ = this;
    if (this.state.notPassPassword) {
      return false;
    }
    return AppActions.setWifi(this.state.mode, this.state[ this.state.mode + 'Content'].ssid, this.state[ this.state.mode + 'Content'].key, window.session)
    .then(() => {
      return AppActions.commitAndReboot(window.session)
      .then(() => {
        return;
      })
      .catch((err) => {
        if (err === 'no data') {
          return false;
        }
        return err;
      });
    })
    .then(() => {
      return this$._returnToIndex(__('Configuration saved. You can sign in to the console after your device has restarted.'));
    })
    .catch((err) => {
      if (err === 'Access denied') {
        this$.setState({
          errorMsgTitle: __('Access denied'),
          errorMsg: __('Your token was expired, please sign in again.'),
        });
        return this$.refs.errorMsg.show();
      }
      alert('[' + err + '] Please try again!');
    });
  }

  _cancelBoardMsgDialog() {
    this.refs.boardMsgDialog.dismiss();
    window.localStorage.removeItem('session');
    window.localStorage.removeItem('info');
    const this$ = this;
    return AppDispatcher.dispatch({
      APP_PAGE: 'LOGIN',
      successMsg: this$.state.boardSuccessMsg || null,
      errorMsg: null,
    });
  }

  _cancelErrorMsgDialog() {
    this.refs.errorDialog.dismiss();
    this._returnToIndex();
  }


}

networkComponent.childContextTypes = {
  muiTheme: React.PropTypes.object,
};
