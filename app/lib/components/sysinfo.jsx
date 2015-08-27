import React from 'react';
import Radium from 'radium';
import Dropzone from 'react-dropzone';
import mui from 'material-ui';
var AppActions     = require('../actions/appActions');
var AppDispatcher  = require('../dispatcher/appDispatcher');

let {
  TextField,
  Card,
  FlatButton,
  RaisedButton,
  Dialog,
  c
} = mui;

var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;
@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.state.PlatformBlockIsEdit = false;
    this.state.SoftwareBlockIsEdit = false;
    this.state.files = [{name:''}];
    this.state.modal = false;
    this.state.upgradeFirmware = false;
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
    this._editPlatformBlock = this._editPlatformBlock.bind(this);
    this._editSoftwareBlock = this._editSoftwareBlock.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onReset = this._onReset.bind(this);
    this._onFactorySubmit = this._onFactorySubmit.bind(this);
    this._handleStandardDialogTouchTap = this._handleStandardDialogTouchTap.bind(this);
    this._onSubmitFirmware = this._onSubmitFirmware.bind(this)
    this._submitPlatformBlock = this._submitPlatformBlock.bind(this);
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
    return AppActions.resetFactory(window.session)
    .then(function(data) {
      alert('Success!');
      return AppDispatcher.dispatch({
        APP_PAGE: 'LOGIN',
        successMsg: null,
        errorMsg: null
      });
    })
    .catch(function(err) {
      alert(err + ' Please try again!');
    });
  }

  _onDrop(files) {
    console.log('Received files: ', files);
    this.setState({
      files: files
    })
  }

  _onReset(status) {
    console.log(status)
    this.setState({
      modal: status
    })
  }

  _submitPlatformBlock() {
    var _this = this;
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
      alert('Success! We will reboot now!');
      return AppDispatcher.dispatch({
        APP_PAGE: 'LOGIN',
        successMsg: null,
        errorMsg: null
      });
    })
    .catch(function(err) {
      alert(err);
    })
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
      alert('Uploading firmware successful, but board is currently in the process of updating firmware. Please refresh again in around 10 minutes, or after board finishes updating.')
      window.localStorage.removeItem('session');
      window.localStorage.removeItem('info');
      return AppDispatcher.dispatch({
        APP_PAGE: 'LOGIN',
        successMsg: null,
        errorMsg: null
      });
    })
    .catch(function(err) {
      console.log(err)
      alert('Failed to upgrade image');
    })
  }

  _handleStandardDialogTouchTap() {
    this.refs.standardDialog.show();
  }

  render() {
    var PlatformBlock =
      <div>
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
          fullWidth={true}
          backgroundColor={Colors.amber700}
          onClick={()=>{this._editPlatformBlock(true)}}
          style={{width: '100%', textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
        </RaisedButton>
      </div>

    if (this.state.PlatformBlockIsEdit) {
      PlatformBlock =
        <div>
          <h3 style={styles.h3}>Platform information</h3>

          <TextField
            hintText="Device name"
            style={{width: '100%'}}
            defaultValue={this.state.deviceName}
            onChange={ (e) => {this.setState({deviceName: e.target.value})} }
            underlineStyle={{border: '1px solid #53c34a'}}
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
            style={{width: '100%'}}
            underlineStyle={{border: '1px solid #53c34a'}}
            defaultValue={this.state.password}
            type="password"
            onChange={ (e) => {this.setState({password: e.target.value})} }
            floatingLabelText="Password" />
          <div style={{ display: 'flex',flexDirection: 'row', justifyContent:'space-between', }}>
            <RaisedButton
              linkButton={true}
              label="Cancel"
              onClick={()=>{this._editPlatformBlock(false)}}
              // onClick={this._handleLogin}
              style={{flexGrow:1, textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
            </RaisedButton>
            <RaisedButton
              linkButton={true}
              secondary={true}
              label="Configure & Restart"
              onClick={()=>{this._submitPlatformBlock(false)}}
              backgroundColor={Colors.amber700}
              // onClick={this._handleLogin}
              style={{flexGrow:1, textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
            </RaisedButton>
          </div>
        </div>
    }

    var softwareBlock =
      <div>
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
          backgroundColor={Colors.amber700}
          onClick={()=>{this._editSoftwareBlock(true)}}
          style={{
            width: '100%',
            textAlign: 'center',
            marginTop: '20px',
            marginBottom: '20px'
          }}>
        </RaisedButton>
      </div>
    if (this.state.SoftwareBlockIsEdit) {
      softwareBlock =
        <div>
          <TextField
            hintText="Boot loader version"
            disabled={true}
            style={{ width: '100%' }}
            defaultValue="Boot loader version"
            floatingLabelText="Boot loader version" />
          <TextField
            hintText="Firmware version"
            style={{ width: '100%' }}
            disabled={true}
            defaultValue="Firmware version"
            floatingLabelText="Firmware version" />
          <Dropzone onDrop={this._onDrop} style={{width: '100%', border: '3px dotted #53c34a'}}>
            <div>
              <h3 style={{textAlign: 'center'}}>Firmware upgrade</h3>
              <p style={{textAlign: 'center'}}>Try dropping some files here, or click to select files to upload.</p>
            </div>
            { this.state.files.length !== 0 ?
              <div>
                <p style={{textAlign: 'center'}}>Firmware: {this.state.files[0].name}</p>
              </div> : null
            }
          </Dropzone>
          <div style={{ display: 'flex',flexDirection: 'row', justifyContent:'space-between', }}>
            <Dialog
              title="Upload Firmware"
              ref="uploadDialog"
              modal={this.state.upgradeFirmware}>
              <p>Uploading ...</p>
            </Dialog>
            <RaisedButton
              linkButton={true}
              label="Cancel"
              disabled={this.state.upgradeFirmware}
              onClick={()=>{this._editSoftwareBlock(false)}}
              // onClick={this._handleLogin}
              style={{flexGrow:1, textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
            </RaisedButton>
            <RaisedButton
              linkButton={true}
              secondary={true}
              label="Upgrade & Restart"
              backgroundColor={Colors.amber700}
              disabled={this.state.upgradeFirmware}
              onClick={()=>{this._onSubmitFirmware(this.state.files[0]) }}
              // onClick={this._handleLogin}
              style={{flexGrow:1, textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
            </RaisedButton>
          </div>
        </div>

    }

    let standardActions = [
      { text: 'Cancel'},
      { text: 'Reset now', onTouchTap: this._onFactorySubmit, ref: 'submit' }
    ];

    return (
      <div>
        <Card style={{ paddingRight: '20px', paddingLeft: '20px', paddingTop: '20px' }}>
          { PlatformBlock }
          { softwareBlock }

          <h3 style={styles.h3}>Factory reset</h3>
          <p>Reset the device to its factory default settings.</p>
          <b>Important: This action will remove all your data and settings in the device.</b>
          <p>{this.state.modal}</p>
          <Dialog
            title="Factory reset"
            actions={standardActions}
            actionFocus="submit"
            ref="standardDialog"
            modal={this.state.modal}>
            <p>Are you sure you want to reset?</p>
            <p>You cannot revert this action.</p>
          </Dialog>
          <RaisedButton
            linkButton={true}
            secondary={true}
            label="Reset"
            onTouchTap={this._handleStandardDialogTouchTap}
            backgroundColor={Colors.amber700}
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
