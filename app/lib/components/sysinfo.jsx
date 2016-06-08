import { default as React, PropTypes } from 'react';
import Radium from 'radium';
import Dropzone from 'react-dropzone';
import mui from 'material-ui';
import icon7688 from '../../img/7688.png';
import icon7688Duo from '../../img/7688_duo.png';
import AppActions from '../actions/appActions';
import AppDispatcher from '../dispatcher/appDispatcher';

const {
  TextField,
  Card,
  FlatButton,
  RaisedButton,
  Dialog,
} = mui;
const ThemeManager = new mui.Styles.ThemeManager();
const Colors = mui.Styles.Colors;
const styles = {
  h3: {
    marginBottom: '0px',
    marginTop: '0px',
  },

  panelTitle: {
    tapHighlightColor: 'rgba(0,0,0,0)',
    color: 'rgba(0, 0, 0, 0.498039)',
    fontSize: '16px',
    transform: 'perspective(1px) scale(0.75) translate3d(0px, -28px, 0)',
    transformOrigin: 'left top',
    marginBottom: '0px',
    marginTop: '40px',
  },

  panelContent: {
    borderBottom: '2px dotted #D1D2D3',
    fontSize: '16px',
    marginTop: '-15px',
    paddingBottom: '5px',
    marginBottom: '48px',
  },

  content: {
    paddingRight: '128px',
    paddingLeft: '128px',
    paddingTop: '20px',
    '@media (max-width: 760px)': {
      paddingRight: '20px',
      paddingLeft: '20px',
    },
  },

  editTextField: {
    pointerEvent: 'none',
    width: '100%',
    color: '#353630',
    cursor: 'auto',
    ':hover': {
      cursor: 'auto',
    },
    ':active': {
      cursor: 'auto',
    },
    ':focus': {
      cursor: 'auto',
    },
  },

  h3Top: {
    marginTop: '20px',
    marginBottom: '0px',
  },

  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0',
    width: '100%',
    opacity: '0',
  },

};

@Radium
export default class sysinfoComponent extends React.Component {
  static propTypes = {
    boardInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  }
  constructor(props) {
    super(props);
    this.state = {
      errorMsgTitle: null,
      errorMsg: null,
    };
    this.state.PlatformBlockIsEdit = false;
    this.state.SoftwareBlockIsEdit = false;
    this.state.files = [{ name: '' }];
    this.state.modal = true;
    this.state.upgradeFirmware = true;
    this.state.showPassword = false;
    this.state.notPassPassword = false;
    this.state.boardModel = '';

    const info = JSON.parse(localStorage.getItem('info'));

    if (this.props.boardInfo) {
      this.state.deviceName = this.props.boardInfo.system[Object.keys(this.props.boardInfo.system)[0]].hostname;
      this.state.user = info.user;
      this.state.password = info.password;
      this.state.bootLoaderVersion = this.props.boardInfo.system[Object.keys(this.props.boardInfo.system)[0]].loader_version;
      this.state.firmwareVersion = this.props.boardInfo.system[Object.keys(this.props.boardInfo.system)[0]].firmware_version;
      this.state.macaddr = this.props.boardInfo.network.lan.macaddr;
      this.state.wifiMACName = this.props.boardInfo.network.lan.macaddr.split(':')[3] + this.props.boardInfo.network.lan.macaddr.split(':')[4] + this.props.boardInfo.network.lan.macaddr.split(':')[5];
      this.state.mode = this.props.boardInfo.wifi.radio0.linkit_mode;

      switch (this.state.mode) {
      case 'ap':
        this.state.currentIp = this.props.boardInfo.lan['ipv4-address'][0].address;
        break;
      case 'sta':
        this.state.currentIp = this.props.boardInfo.wan['ipv4-address'][0].address;
        break;
      case 'apsta':
        this.state.currentIp = this.props.boardInfo.wan['ipv4-address'][0].address;
        break;
      default:
        break;
      }
    }

    this._editPlatformBlock = ::this._editPlatformBlock;
    this._editSoftwareBlock = ::this._editSoftwareBlock;
    this._onDrop = ::this._onDrop;
    this._onReset = ::this._onReset;
    this._onFactorySubmit = ::this._onFactorySubmit;
    this._handleStandardDialogTouchTap = ::this._handleStandardDialogTouchTap;
    this._onSubmitFirmware = ::this._onSubmitFirmware;
    this._submitPlatformBlock = ::this._submitPlatformBlock;
    this._cancelDialog = ::this._cancelDialog;
    this._returnToIndex = ::this._returnToIndex;
    this._returnToSetPassword = ::this._returnToSetPassword;
    this._cancelErrorMsgDialog = ::this._cancelErrorMsgDialog;
    this._cancelConfigureFailedDialog = ::this._cancelConfigureFailedDialog;
    this._cancelUpgradeFirmwareFailedDialog = ::this._cancelUpgradeFirmwareFailedDialog;
    this._cancelUpgradeFirmwareSuccessedDialog = ::this._cancelUpgradeFirmwareSuccessedDialog;
    this._cancelBoardMsgDialog = ::this._cancelBoardMsgDialog;
  }

  componentWillMount() {
    const this$ = this;
    AppActions.loadModel(window.session)
    .then((data) => {
      return this$.setState({ boardModel: data.body.result[1].model });
    });
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  render() {
    let textType = 'password';
    let DropzoneContent;
    let showPasswordStyle = {
      width: '100%',
      marginBottom: '44px',
    };
    let errorText;
    let boardImg;
    const standardActions = [
      <FlatButton
        label={ __('Cancel') }
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelDialog }
        hoverColor="none" />,
      <FlatButton
        label={ __('Reset') }
        labelStyle={{ color: Colors.amber700 }}
        hoverColor="none"
        onTouchTap={ this._onFactorySubmit } />,
    ];

    const boardMsgActions = [
      <FlatButton
        label={ __('OK') }
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelBoardMsgDialog }
        hoverColor="none" />,
    ];

    const upgradeFirmwareFailedActions = [
      <FlatButton
        label={ __('OK') }
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelUpgradeFirmwareFailedDialog }
        hoverColor="none" />,
    ];

    const upgradeFirmwareSuccessedActions = [
      <FlatButton
        label={ __('OK') }
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelUpgradeFirmwareSuccessedDialog }
        hoverColor="none" />,
    ];

    const errMsgActions = [
      <FlatButton
        label={__('SIGN IN')}
        labelStyle={{ color: Colors.amber700 }}
        onTouchTap={ this._cancelErrorMsgDialog }
        hoverColor="none" />,
    ];
    if (this.state.showPassword) {
      textType = 'text';
    }
    if (this.state.files.length !== 0) {
      DropzoneContent = (
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
            paddingBottom: '5px',
          }}>{ this.state.files[0].name || __('Choose the file') }</p>
        </div>
      );
    } else {
      DropzoneContent = (
        <div>
          <h3 style={{
            tapHighlightColor: 'rgba(0,0,0,0)',
            color: 'rgba(0,0,0,0.5)',
            fontSize: '16px',
            transform: 'perspective(1px) scale(0.75) translate3d(2px, -28px, 0)',
            transformOrigin: 'left top',
            marginBottom: '0px',
            marginTop: '40px',
          }}>__('Upgrade firmware file')</h3>
          <p style={{
            borderBottom: '1px solid #D1D2D3',
            fontSize: '16px',
            marginTop: '-10px',
            paddingBottom: '5px',
          }}>{__('Choose the file')}</p>
        </div>
      );
    }

    if (this.state.notPassPassword) {
      errorText = (
        <div>
          <p style={{
            color: '#69BE28',
            textAlign: 'left',
            marginTop: '2px',
          }}>{ __('Please use at least 6 alphanumeric characters.') }</p>
        </div>
      );
      showPasswordStyle = {
        marginTop: '20px',
        width: '100%',
        marginBottom: '44px',
      };
    }

    if (this.state.boardModel === 'MediaTek LinkIt Smart7688') {
      boardImg = icon7688;
    } else {
      boardImg = icon7688Duo;
    }

    let PlatformBlock = (
      <div style={ styles.content } key="PlatformBlock">
        <h3 style={ styles.h3 }>{ __('Platform information') }</h3>
        <h3 style={ styles.panelTitle }>{ __('Device name') }</h3>
        <p style={ styles.panelContent }>{ this.state.deviceName }</p>
        <h3 style={ styles.panelTitle }>{ __('Current IP address') }</h3>
        <p style={ styles.panelContent }>{ this.state.currentIp }</p>

        <h3 style={ [styles.h3Top, { marginTop: '-15px' }] }>{ __('Account information') }</h3>
        <h3 style={ styles.panelTitle }>{ __('Account') }</h3>
        <p style={ styles.panelContent }>root(default)</p>
        <h3 style={ styles.panelTitle }>{ __('Password') } <b style={{ color: 'red' }}>*</b></h3>
        <p style={ styles.panelContent }><input type="password" disable style={{ border: '0px', fontSize: '18px', letterSpacing: '3px' }}value={this.state.password} /></p>
        <RaisedButton
          linkButton
          secondary
          label={ __('Configure') }
          fullWidth
          backgroundColor={ Colors.amber700 }
          onTouchTap={() => { this._editPlatformBlock(true); } }
          style={{
            width: '100%',
            textAlign: 'center',
            marginTop: '-20px',
            marginBottom: '20px',
          }} />
      </div>
    );

    if (this.state.PlatformBlockIsEdit) {
      PlatformBlock = (
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
              borderWidth: '2px',
            }}
            onChange={
              (e) => {
                this.setState({ deviceName: e.target.value });
              }
            }
            floatingLabelText={ __('Device name') } />
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

          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: '-40px',
          }}>
            <RaisedButton
              linkButton
              label={ __('Cancel') }
              onTouchTap={ () => { this._editPlatformBlock(false); } }
              backgroundColor="#EDEDED"
              labelColor="#999A94"
              style={{
                width: '236px',
                flexGrow: 1,
                textAlign: 'center',
                marginTop: '20px',
                marginBottom: '20px',
                marginRight: '10px',
              }} />
            <RaisedButton
              linkButton
              secondary
              label={ __('Configure & Restart') }
              onTouchTap={
                () => {
                  this._submitPlatformBlock(false);
                }
              }
              backgroundColor={ Colors.amber700 }
              style={{
                width: '236px',
                flexGrow: 1,
                textAlign: 'center',
                marginTop: '20px',
                marginBottom: '20px',
                marginLeft: '10px'}} />
          </div>
        </div>
      );
    }

    let softwareBlock = (
      <div style={ styles.content } key="softwareBlock">
        <h3 style={styles.h3}>{ __('Software information') }</h3>
        <h3 style={ styles.panelTitle }>{ __('Boot loader version') }</h3>
        <p style={ styles.panelContent }>{ this.state.bootLoaderVersion }</p>
        <h3 style={ styles.panelTitle }>{ __('Firmware version') }</h3>
        <p style={ styles.panelContent }>{ this.state.firmwareVersion }</p>

        <RaisedButton
          linkButton
          secondary
          label={ __('Upgrade firmware') }
          backgroundColor={ Colors.amber700 }
          onTouchTap={
            ()=> {
              this._editSoftwareBlock(true);
            }
          }
          style={{
            width: '100%',
            textAlign: 'center',
            marginTop: '-20px',
            marginBottom: '20px',
          }} />
      </div>
    );

    if (this.state.SoftwareBlockIsEdit) {
      softwareBlock = (
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
            justifyContent: 'space-between',
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
              title={ __('The Firmware Is Uploaded And Flashing. Please Note:') }
              actions={ upgradeFirmwareSuccessedActions }
              actionFocus="submit"
              ref="upgradeFirmwareSuccessedDialog"
              modal={ this.state.modal }>
              <ul style={{ lineHeight: '20px' }}>
                <li style={{ color: '#999A94' }}>{__('The Wi-Fi LED blinks fast for about 3 minutes.')}</li>
                <li style={{ color: '#999A94' }}>{__('After firmware is flashed, the board reboots and the Wi-Fi LED turns on solid for 30 seconds and then turns off.')}</li>
                <li style={{ color: '#999A94' }}>{__('The board is now in AP mode. Please connect to it.')}</li>
                <li style={{ color: '#999A94' }}>{__('The Wi-Fi LED will blink 3 times per second when the board is connected to a client device.')}</li>
              </ul>
            </Dialog>
            <Dialog
              title={ __('Upload Firmware') }
              ref="uploadDialog"
              modal={ this.state.upgradeFirmware }>
              <p>{ __('Uploading ...') }</p>
            </Dialog>
            <RaisedButton
              linkButton
              label={ __('Cancel') }
              backgroundColor="#EDEDED"
              labelColor="#999A94"
              style={{
                width: '236px',
                flexGrow: 1,
                textAlign: 'center',
                marginTop: '20px',
                marginBottom: '20px',
                marginRight: '10px',
              }}
              disabled={ this.state.upgradeFirmware }
              onTouchTap={
                () => {
                  this._editSoftwareBlock(false);
                }
              } />
            <RaisedButton
              linkButton
              secondary
              label={ __('Upgrade & Restart') }
              backgroundColor={ Colors.amber700 }
              disabled={ this.state.upgradeFirmware }
              onTouchTap={
                () => {
                  this._onSubmitFirmware(this.state.files[0]);
                }
              }
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
      );
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
              alignItems: 'center',
            }}>
            <p style={{
              fontSize: '16px',
              color: '#999A94',
              lineHeight: '18.54px',
              marginTop: '-15px',
            }}>{ __('See the Wi-Fi LED, it will light on steadily and start to blink or turn off afterwards. When the LED starts to blink or turn off, reload this webpage to sign in again.') }</p>
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
              title={__('Are you sure you want to reset?')}
              actions={ standardActions }
              actionFocus="submit"
              ref="standardDialog"
              modal={ this.state.modal }>
              <p style={{ color: '#999A94', marginTop: '-20px' }}>{__('This action will remove all your data and settings from the device. You cannot undo this action.')}</p>
            </Dialog>
            <RaisedButton
              linkButton
              secondary
              label={ __('Reset') }
              onTouchTap={ this._handleStandardDialogTouchTap }
              backgroundColor={ Colors.amber700 }
              style={{
                width: '100%',
                textAlign: 'center',
                marginTop: '10px',
                marginBottom: '20px',
              }} />
          </div>
        </Card>
      </div>
    );
  }

  _editPlatformBlock(status) {
    const this$ = this;
    setTimeout(() => { return this$.setState({ PlatformBlockIsEdit: status }); }, 300);
  }

  _editSoftwareBlock(status) {
    const this$ = this;
    setTimeout(() => { return this$.setState({ SoftwareBlockIsEdit: status }); }, 300);
  }

  _onFactorySubmit() {
    const this$ = this;
    return AppActions.resetFactory(window.session)
    .then(() => {
      return this$.refs.standardDialog.dismiss();
    })
    .then(() => {
      return this$._returnToSetPassword();
    })
    .catch((err) => {
      if (err === 'Access denied') {
        alert(err);
        if (AppActions.isLocalStorageNameSupported) {
          delete window.localStorage.session;
          delete window.localStorage.info;
        } else {
          delete window.memoryStorage.session;
          delete window.memoryStorage.info;
        }
        return AppDispatcher.dispatch({
          APP_PAGE: 'LOGIN',
          successMsg: null,
          errorMsg: null,
        });
      }
      alert(err + ' Please try again!');
    });
  }

  _onDrop(files) {
    this.setState({
      files: files,
      upgradeFirmware: false,
    });
  }

  _onReset(status) {
    this.setState({
      modal: status,
    });
  }

  _submitPlatformBlock() {
    const this$ = this;
    const password = this.state.password;
    if (password.length < 6) {
      return false;
    }
    return AppActions.resetHostName(this$.state.deviceName, window.session)
    .then(() => {
      return AppActions.resetPassword('root', this$.state.password, window.session);
    })
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
        this$.setState({ errorMsgTitle: __('Access denied'), errorMsg: __('Your token was expired, please sign in again.') });
        return this$.refs.errorMsg.show();
      }
      alert(err);
    });
  }

  _cancelDialog() {
    this.refs.standardDialog.dismiss();
  }

  _onSubmitFirmware(file) {
    const this$ = this;
    this.setState({
      upgradeFirmware: true,
    });
    this.refs.uploadDialog.show();
    return AppActions.uploadFirmware(file, window.session)
    .then(() => {
      return AppActions.checkFirmware(window.session);
    })
    .then((res) => {
      const reply = res.body.result[1];
      if (reply.code && reply.stdout) {
        throw "Image check failed - " + reply.stdout;
      }
      return AppActions.activeFirmware(window.session);
    })
    .then(() => {
      this$.refs.uploadDialog.dismiss();
      return this$.refs.upgradeFirmwareSuccessedDialog.show();
    })
    .catch((err) => {
      this$.refs.uploadDialog.dismiss();
      if (err === 'Access denied') {
        this$.setState({ errorMsgTitle: __('Access denied'), errorMsg: __('Your token was expired, please sign in again.') });
        return this$.refs.errorMsg.show();
      }
      alert(err);
    });
  }

  _returnToIndex(successMsg, errorMsg) {
    if (successMsg) {
      this.refs.boardMsgDialog.show();
      this.setState({ boardSuccessMsg: successMsg });
    } else {
      if (AppActions.isLocalStorageNameSupported) {
        delete window.localStorage.session;
        delete window.localStorage.info;
      } else {
        delete window.memoryStorage.session;
        delete window.memoryStorage.info;
      }

      return AppDispatcher.dispatch({
        APP_PAGE: 'LOGIN',
        successMsg: successMsg || null,
        errorMsg: errorMsg || null,
      });
    }
  }

  _returnToSetPassword() {
    if (AppActions.isLocalStorageNameSupported) {
      delete window.localStorage.session;
      delete window.localStorage.info;
    } else {
      delete window.memoryStorage.session;
      delete window.memoryStorage.info;
    }

    return AppDispatcher.dispatch({
      APP_PAGE: 'FIRSTLOGIN',
      successMsg: null,
      errorMsg: null,
    });
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
    // this.refs.boardMsgDialog.show();
    this._returnToSetPassword();
  }

  _cancelBoardMsgDialog() {
    this.refs.boardMsgDialog.dismiss();
    if (AppActions.isLocalStorageNameSupported) {
      delete window.localStorage.session;
      delete window.localStorage.info;
    } else {
      delete window.memoryStorage.session;
      delete window.memoryStorage.info;
    }
    const this$ = this;
    return AppDispatcher.dispatch({
      APP_PAGE: 'LOGIN',
      successMsg: this$.state.boardSuccessMsg || null,
      errorMsg: null,
    });
  }


}

sysinfoComponent.childContextTypes = {
  muiTheme: React.PropTypes.object,
};
