import React from 'react';
import Radium from 'radium';
import Dropzone from 'react-dropzone';
import mui from 'material-ui';
import icon_7688 from '../../img/7688.png';
import icon_7688Duo from '../../img/7688_duo.png';

var AppActions     = require('../actions/appActions');
var AppDispatcher  = require('../dispatcher/appDispatcher');

let {
  TextField,
  Card,
  FlatButton,
  RaisedButton,
  Dialog
} = mui;

var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      errorMsgTitle: null,
      errorMsg: null
    };
    this.state.PlatformBlockIsEdit = false;
    this.state.SoftwareBlockIsEdit = false;
    this.state.files = [{ name:'' }];
    this.state.modal = true;
    this.state.upgradeFirmware = false;
    this.state.showPassword = false;
    this.state.notPassPassword = false;
    this.state.boardModel = '';

    var info = JSON.parse(localStorage.getItem('info'));

    if (this.props.boardInfo) {
      this.state.deviceName = this.props.boardInfo.system[Object.keys(this.props.boardInfo.system)[0]].hostname;
      this.state.user = info.user;
      this.state.password = info.password;
      this.state.bootLoaderVersion = this.props.boardInfo.system[Object.keys(this.props.boardInfo.system)[0]].loader_version;
      this.state.firmwareVersion = this.props.boardInfo.system[Object.keys(this.props.boardInfo.system)[0]].firmware_version;

      if (this.props.boardInfo.wifi.sta.disabled === '1') {
        this.state.mode = 'ap';
        this.state.macaddr = this.props.boardInfo.network.lan.macaddr;
        this.state.currentIp = this.props.boardInfo.lan['ipv4-address'][0].address;
      } else {
        this.state.mode = 'station';
        this.state.macaddr = this.props.boardInfo.network.wan.macaddr;
        this.state.currentIp = this.props.boardInfo.wan['ipv4-address'][0].address;
      }
    }

    this._editPlatformBlock = this._editPlatformBlock.bind(this);
    this._editSoftwareBlock = this._editSoftwareBlock.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onReset = this._onReset.bind(this);
    this._onFactorySubmit = this._onFactorySubmit.bind(this);
    this._handleStandardDialogTouchTap = this._handleStandardDialogTouchTap.bind(this);
    this._onSubmitFirmware = this._onSubmitFirmware.bind(this);
    this._submitPlatformBlock = this._submitPlatformBlock.bind(this);
    this._cancelDialog = this._cancelDialog.bind(this);
    this._returnToIndex = this._returnToIndex.bind(this);
    this._cancelErrorMsgDialog = this._cancelErrorMsgDialog.bind(this);
    this._cancelConfigureFailedDialog = this._cancelConfigureFailedDialog.bind(this);
    this._cancelUpgradeFirmwareFailedDialog = this._cancelUpgradeFirmwareFailedDialog.bind(this);
    this._cancelUpgradeFirmwareSuccessedDialog = this._cancelUpgradeFirmwareSuccessedDialog.bind(this);
    this._cancelBoardMsgDialog = this._cancelBoardMsgDialog.bind(this);
  }

  componentWillMount () {
    var self = this;
    AppActions.loadModel(window.session)
    .then(function(data) {
      return self.setState({ boardModel: data.body.result[1].model });
    });
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _editPlatformBlock(status) {
    var _this = this;
    setTimeout(function(){ return _this.setState({ PlatformBlockIsEdit: status }); }, 300);
  }

  _editSoftwareBlock(status) {
    var _this = this;
    setTimeout(function(){ return _this.setState({ SoftwareBlockIsEdit: status }); }, 300);
  }

  _onFactorySubmit() {
    var _this = this;
    return AppActions.resetFactory(window.session)
    .then(function(data) {
      return _this.refs.standardDialog.dismiss();
    })
    .then(function(data) {
      return _this._returnToIndex(__('Configuration saved. You can sign in to the console after your device has restarted.'));
    })
    .catch(function(err) {
      if (err === 'Access denied') {
        alert(err);
        window.localStorage.removeItem('session');
        window.localStorage.removeItem('info');
        return AppDispatcher.dispatch({
          APP_PAGE: 'LOGIN',
          successMsg: null,
          errorMsg: null
        });
      }
      alert(err + ' Please try again!');
    });
  }

  _onDrop(files) {
    this.setState({
      files: files
    })
  }

  _onReset(status) {
    this.setState({
      modal: status
    })
  }

  _submitPlatformBlock() {
    var _this = this;
    var password = this.state.password;
    if (password.length < 6) {
      return ;
    }
    return AppActions.resetHostName(_this.state.deviceName, window.session)
    .then(function(data) {
      return AppActions.resetPassword('root', _this.state.password, window.session);
    })
    .then(function(data) {
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
    .then(function(data) {
      return _this._returnToIndex(__('Configuration saved. You can sign in to the console after your device has restarted.'));
    })
    .catch(function(err) {
      if (err === 'Access denied') {
        _this.setState({ errorMsgTitle: __('Access denied'), errorMsg: __('Your token was expired, please sign in again.') });
        return _this.refs.errorMsg.show();
      }
      alert(err);
    });

  }

  _cancelDialog() {
    this.refs.standardDialog.dismiss();
  }

  _onSubmitFirmware(file) {
    var _this = this;
    this.setState({
      upgradeFirmware: true
    });
    this.refs.uploadDialog.show();
    return AppActions.uploadFirmware(file, window.session)
    .then(function(data) {
      return AppActions.checkFirmware(window.session)
    })
    .then(function(res) {
      var reply = res.body.result[1];
      if (reply.code && reply.stdout) {
        throw "Image check failed - " + reply.stdout;
      }
      return AppActions.activeFirmware(window.session)
    })
    .then(function(data) {
      _this.refs.uploadDialog.dismiss();
      return _this.refs.upgradeFirmwareSuccessedDialog.show();
    })
    .catch(function(err) {
      _this.refs.uploadDialog.dismiss();
      if (err === 'Access denied') {
        _this.setState({ errorMsgTitle: __('Access denied'), errorMsg: __('Your token was expired, please sign in again.') });
        return _this.refs.errorMsg.show();
      }
      alert(err);
    })
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
        errorMsg: errorMsg|| null
      });
    }
  }

  _handleStandardDialogTouchTap() {
    this.refs.standardDialog.show();
  }

  _cancelErrorMsgDialog() {
    this.refs.errorDialog.dismiss();
    this._returnToIndex();
  }

  _cancelConfigureFailedDialog() {
    this.refs.configureFailedDialog.dismiss();
  }

  _cancelUpgradeFirmwareFailedDialog() {
    this.refs.upgradeFirmwareFailedDialog.dismiss();
  }

  _cancelUpgradeFirmwareSuccessedDialog() {
    this.refs.upgradeFirmwareSuccessedDialog.dismiss();
    this.refs.boardMsgDialog.show();
  }

  _cancelBoardMsgDialog() {
    this.refs.boardMsgDialog.dismiss();
    window.localStorage.removeItem('session');
    window.localStorage.removeItem('info');
    var _this = this;
    return AppDispatcher.dispatch({
      APP_PAGE: 'LOGIN',
      successMsg: _this.state.boardSuccessMsg || null,
      errorMsg: null
    });
  }

  render() {
    if (this.state.showPassword) {
      var textType = 'text';
    } else {
      var textType = 'password';
    }
    if (this.state.files.length !== 0) {
      var DropzoneContent =
        <div>
          <h3 style={{
            tapHighlightColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0.5)',
            fontSize: '16px',
            transform: 'perspective(1px) scale(0.75) translate3d(2px, -28px, 0)',
            transformOrigin: 'left top',
            marginBottom: '0px',
            marginTop: '40px'}}>{__('Upgrade firmware file')}</h3>
          <p style={{
            borderBottom: '1px solid #D1D2D3',
            fontSize: '16px',
            marginTop: '-10px',
            paddingBottom: '5px'
          }}>{ this.state.files[0].name || __('Choose the file') }</p>
        </div>
    } else {
      var DropzoneContent =
        <div>
          <h3 style={{
          tapHighlightColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0.5)',
          fontSize: '16px',
          transform: 'perspective(1px) scale(0.75) translate3d(2px, -28px, 0)',
          transformOrigin: 'left top',
          marginBottom: '0px',
          marginTop: '40px'
        }}>__('Upgrade firmware file')</h3>
          <p style={{
            borderBottom: '1px solid #D1D2D3',
            fontSize: '16px',
            marginTop: '-10px',
            paddingBottom: '5px'
          }}>{__('Choose the file')}</p>
        </div>
    }

    let standardActions = [
      <FlatButton
        label={ __('Cancel') }
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelDialog }
        hoverColor="none" />,
      <FlatButton
        label={ __('Reset') }
        labelStyle={{ color: Colors.amber700 }}
        hoverColor="none"
        onTouchTap={ this._onFactorySubmit } />
    ];

    let boardMsgActions = [
      <FlatButton
        label={ __('OK') }
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelBoardMsgDialog }
        hoverColor="none" />
    ];

    let configureFailedActions = [
      <FlatButton
        label={ __('OK') }
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelConfigureFailedDialog }
        hoverColor="none" />
    ];

    let upgradeFirmwareFailedActions = [
      <FlatButton
        label={ __('OK') }
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelUpgradeFirmwareFailedDialog }
        hoverColor="none" />
    ];

    let upgradeFirmwareSuccessedActions = [
      <FlatButton
        label={ __('OK') }
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelUpgradeFirmwareSuccessedDialog }
        hoverColor="none" />
    ];

    let errMsgActions = [
      <FlatButton
        label={__('SIGN IN')}
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelErrorMsgDialog }
        hoverColor="none" />
    ]

    if (this.state.notPassPassword) {
      var errorText =
        <div>
          <p style={{
            color:'#69BE28',
            textAlign: 'left',
            marginTop: '2px'
          }}>{ __('Please use at least 6 alphanumeric characters.') }</p>
        </div>
      var showPasswordStyle = {
        marginTop: '20px',
        width: '100%',
        marginBottom: '44px'
      };
    } else {
      var showPasswordStyle = {
        width: '100%',
        marginBottom: '44px'
      };
      var errorText;
    }

    if (this.state.boardModel === 'MediaTek LinkIt Smart7688') {
      var boardImg = icon_7688;
    } else {
      var boardImg = icon_7688Duo;
    }

    var PlatformBlock =
      <div style={ styles.content } key="PlatformBlock">
        <h3 style={ styles.h3 }>{ __('Platform information') }</h3>
        <h3 style={ styles.panelTitle }>{ __('Device name') }</h3>
        <p style={ styles.panelContent }>{ this.state.deviceName }</p>
        <h3 style={ styles.panelTitle }>{ __('MAC address') }</h3>
        <p style={ styles.panelContent }>{ this.state.macaddr }</p>
        <h3 style={ styles.panelTitle }>{ __('Current IP address') }</h3>
        <p style={ styles.panelContent }>{ this.state.currentIp }</p>

        <h3 style={ [styles.h3Top, { marginTop: '-15px' }] }>{ __('Account information') }</h3>
        <h3 style={ styles.panelTitle }>{ __('Account') }</h3>
        <p style={ styles.panelContent }>root(default)</p>
        <h3 style={ styles.panelTitle }>{ __('Password') } <b style={{ color: 'red' }}>*</b></h3>
        <p style={ styles.panelContent }><input type="password" disable={true} style={{ border: '0px', fontSize: '18px', letterSpacing: '3px' }}value={this.state.password} /></p>
        <RaisedButton
          linkButton={true}
          secondary={true}
          label={ __('Configure') }
          fullWidth={true}
          backgroundColor={ Colors.amber700 }
          onTouchTap={()=>{ this._editPlatformBlock(true)} }
          style={{
            width: '100%',
            textAlign: 'center',
            marginTop: '-20px',
            marginBottom: '20px'
          }}>
        </RaisedButton>
      </div>

    if (this.state.PlatformBlockIsEdit) {
      PlatformBlock =
        <div style={ styles.content } key="PlatformBlockIsEdit">
          <h3 style={ styles.h3 }>{ __('Platform information') }</h3>
          <TextField
            hintText={ __('Device name') }
            floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
            style={{ width: '100%' }}
            defaultValue={ this.state.deviceName }
            underlineStyle={{ borderColor: '#D1D2D3' }}
            underlineFocusStyle={{
              borderColor: Colors.amber700,
              borderWidth: '2px'
            }}
            onChange={
              (e) => {
                this.setState({ deviceName: e.target.value });
              }
            }
            floatingLabelText={ __('Device name') } />
          <h3 style={ styles.panelTitle }>{ __('MAC address') }</h3>
          <p style={ styles.panelContent }>{ this.state.macaddr }</p>
          <h3 style={ styles.panelTitle }>{ __('Current IP address') }</h3>
          <p style={ styles.panelContent }>{ this.state.currentIp }</p>

          <h3 style={ [styles.h3Top, { marginTop: '-15px' }] }>{ __('Account information') }</h3>

          <h3 style={ styles.panelTitle }>{ __('Account') }</h3>
          <p style={ styles.panelContent }>root(default)</p>
          <TextField
            hintText={ __('Password') }
            style={{ width: '100%', marginTop: '-40px' }}
            underlineStyle={{ borderColor: '#D1D2D3' }}
            defaultValue={ this.state.password }
            floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
            underlineFocusStyle={{ borderColor: Colors.amber700 }}
            type={ textType }
            errorStyle={{ borderColor: Colors.amber700 }}
            errorText={ errorText }
            onChange={
              (e) => {
                if (e.target.value.length < 6) {
                  this.setState({ notPassPassword: true, password: e.target.value });
                } else {
                  this.setState({ password: e.target.value, notPassPassword: false });
                }
              }
            }
            floatingLabelText={
              <div>
                { __('Password') } <b style={{ color: 'red' }}>*</b>
              </div>
            } />
          <div style={ showPasswordStyle }>
            <a
              onTouchTap={
                (e) => {
                  this.setState({
                    showPassword: !this.state.showPassword
                  });
                }
              }
              style={{
                textAlign: 'left',
                color: Colors.amber700,
                textDecoration: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}>{ __('SHOW PASSWORD') }</a>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent:'space-between',
            marginTop: '-40px'
          }}>
            <RaisedButton
              linkButton={ true }
              label={ __('Cancel') }
              onTouchTap={ ()=>{ this._editPlatformBlock(false) } }
              backgroundColor="#EDEDED"
              labelColor="#999A94"
              style={{
                width: '236px',
                flexGrow: 1,
                textAlign: 'center',
                marginTop: '20px',
                marginBottom: '20px',
                marginRight: '10px'
              }}>
            </RaisedButton>
            <RaisedButton
              linkButton={true}
              secondary={true}
              label={ __('Configure & Restart') }
              onTouchTap={
                () => {
                  this._submitPlatformBlock(false)
                }
              }
              backgroundColor={ Colors.amber700 }
              style={{
                width: '236px',
                flexGrow:1,
                textAlign: 'center',
                marginTop: '20px',
                marginBottom: '20px',
                marginLeft: '10px'}}>
            </RaisedButton>
          </div>
        </div>
    }

    var softwareBlock =
      <div style={ styles.content } key="softwareBlock">
        <h3 style={styles.h3}>{ __('Software information') }</h3>
        <h3 style={ styles.panelTitle }>{ __('Boot loader version') }</h3>
        <p style={ styles.panelContent }>{ this.state.bootLoaderVersion }</p>
        <h3 style={ styles.panelTitle }>{ __('Firmware version') }</h3>
        <p style={ styles.panelContent }>{ this.state.firmwareVersion }</p>

        <RaisedButton
          linkButton={true}
          secondary={true}
          label={ __('Upgrade firmware') }
          backgroundColor={ Colors.amber700 }
          onTouchTap={
            ()=>{
              this._editSoftwareBlock(true)
            }
          }
          style={{
            width: '100%',
            textAlign: 'center',
            marginTop: '-20px',
            marginBottom: '20px'
          }}>
        </RaisedButton>
      </div>

    if (this.state.SoftwareBlockIsEdit) {
      softwareBlock =
        <div style={ styles.content } key="softwareBlock">
          <h3 style={ styles.h3 }>{__('Software information')}</h3>
          <h3 style={ styles.panelTitle }>{ __('Boot loader version') }</h3>
          <p style={ styles.panelContent }>{ this.state.bootLoaderVersion }</p>
          <h3 style={ styles.panelTitle }>{ __('Firmware version') }</h3>
          <p style={ styles.panelContent }>{ this.state.firmwareVersion }</p>
          <Dropzone onDrop={ this._onDrop } style={{ width: '100%', cursor: 'pointer' }}>
            { DropzoneContent }
          </Dropzone>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent:'space-between'
          }}>
            <Dialog
              title={ __('Firmware upgrade failed.') }
              actions={ upgradeFirmwareFailedActions }
              actionFocus="submit"
              ref="upgradeFirmwareFailedDialog"
              modal={ this.state.modal }>
              <p style={{ color: '#999A94', marginTop: '-20px' }}>{ __('Please consult the troubleshooting guide and then try again.') }</p>
            </Dialog>
            <Dialog
              title={ __('The firmware has been pushed to the device.') }
              actions={ upgradeFirmwareSuccessedActions }
              actionFocus="submit"
              ref="upgradeFirmwareSuccessedDialog"
              modal={ this.state.modal }>
              <p style={{ color: '#999A94', marginTop: '-10px' }}>{__('Please wait while the device upgrades to the new firmware. You may sign in to the console after the firmware upgrade is completed.')}</p>
              <p style={{ color: '#999A94', marginTop: '0px' }}>{__('Note: Do not disconnect the device from power source during firmware upgrade, or else the device will fail to boot up.')}</p>
              <p style={{ color: '#999A94', marginTop: '0px' }}>{__('Check troubleshooting guide for more information.')}</p>
            </Dialog>
            <Dialog
              title={ __("Upload Firmware") }
              ref="uploadDialog"
              modal={ this.state.upgradeFirmware }>
              <p>{ __('Uploading ...') }</p>
            </Dialog>
            <RaisedButton
              linkButton={true}
              label={ __("Cancel") }
              backgroundColor="#EDEDED"
              labelColor="#999A94"
              style={{
                width: '236px',
                flexGrow: 1,
                textAlign: 'center',
                marginTop: '20px',
                marginBottom: '20px',
                marginRight: '10px'
              }}
              disabled={ this.state.upgradeFirmware }
              onTouchTap={
                ()=>{
                  this._editSoftwareBlock(false);
                }
              }
            >
            </RaisedButton>
            <RaisedButton
              linkButton={true}
              secondary={true}
              label={ __("Upgrade & Restart") }
              backgroundColor={ Colors.amber700 }
              disabled={ this.state.upgradeFirmware }
              onTouchTap={
                ()=>{
                  this._onSubmitFirmware(this.state.files[0]);
                }
              }
              style={{
                width: '236px',
                flexGrow:1,
                textAlign: 'center',
                marginTop: '20px',
                marginBottom: '20px',
                marginLeft: '10px'
              }}
              >
            </RaisedButton>
          </div>
        </div>
    }

    return (

      <div>
        <Card>
          <Dialog
            title={__('Device Restarting. Please Wait…')}
            actionFocus="submit"
            ref="boardMsgDialog"
            actions={ boardMsgActions }
            modal={ this.state.modal }>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <p style={{
              fontSize: '16px',
              color: '#999A94',
              lineHeight: '18.54px',
              marginTop: '-15px'
            }}>{ __('See the Wi-Fi LED, it will light on steadily and start to blink or turn off afterwards. When the LED starts to blink or turn off, reload this webpage to sign in again.') }</p>
            <img src={ boardImg } style={{ width: "350px" }} />
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
          { PlatformBlock }
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)', marginTop: '20px', marginBottom: '0px' }}></div>
          { softwareBlock }
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)', marginTop: '20px', marginBottom: '0px' }}></div>
          <div style={ styles.content } key="reset">
            <h3 style={ styles.h3 }>{__('Factory reset')}</h3>
            <p style={{ marginBottom: '0px' }}>{__('Reset the device to its default settings.')}</p>
            <b style={{ color: '#DB4437' }}>{__('Important: This action will remove all your data and settings from the device.')}</b>
            <p>{ this.state.modal }</p>
            <Dialog
              title={__("Are you sure you want to reset?")}
              actions={ standardActions }
              actionFocus="submit"
              ref="standardDialog"
              modal={ this.state.modal }>
              <p style={{ color: '#999A94', marginTop: '-20px' }}>{__('This action will remove all your data and settings from the device. You cannot undo this action.')}</p>
            </Dialog>
            <RaisedButton
              linkButton={ true }
              secondary={ true }
              label={ __('Reset') }
              onTouchTap={ this._handleStandardDialogTouchTap }
              backgroundColor={ Colors.amber700 }
              style={{
                width: '100%',
                textAlign: 'center',
                marginTop: '10px',
                marginBottom: '20px'
              }}>
            </RaisedButton>
          </div>
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
  panelTitle: {
    tapHighlightColor: 'rgba(0,0,0,0)',
    color: 'rgba(0, 0, 0, 0.498039)',
    fontSize: '16px',
    transform: 'perspective(1px) scale(0.75) translate3d(0px, -28px, 0)',
    transformOrigin: 'left top',
    marginBottom: '0px',
    marginTop: '40px'
  },
  panelContent: {
    borderBottom: '2px dotted #D1D2D3',
    fontSize: '16px',
    marginTop: '-15px',
    paddingBottom: '5px',
    marginBottom: '48px'
  },
  content: {
    paddingRight: '128px',
    paddingLeft: '128px',
    paddingTop: '20px',
    '@media (max-width: 760px)': {
      paddingRight: '20px',
      paddingLeft: '20px',
    }
  },
  editTextField: {
    pointerEvent: 'none',
    width: '100%',
    color: '#353630',
    cursor: 'auto',
    ':hover': {
      cursor: 'auto'
    },
    ':active': {
      cursor: 'auto'
    },
    ':focus': {
      cursor: 'auto'
    }
  },
  h3Top: {
    marginTop:'20px',
    marginBottom: '0px'
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0',
    width: '100%',
    opacity: '0'
  },
}
loginComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};


export default loginComponent;
