import React from 'react';
import Radium from 'radium';
import Dropzone from 'react-dropzone';
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
    this.state.PlatformBlockIsEdit = false;
    this.state.SoftwareBlockIsEdit = false;
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

  _onDrop(files) {
    console.log('Received files: ', files);
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
              onClick={()=>{this._editPlatformBlock(false)}}
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
          <Dropzone onDrop={this._onDrop} style={{width: '100%', border: '3px dotted #aaa'}}>
            <div>
              <h3 style={{textAlign: 'center'}}>Upload firmware</h3>
              <p style={{textAlign: 'center'}}>Try dropping some files here, or click to select files to upload.</p>
            </div>
          </Dropzone>
          <div style={{ display: 'flex',flexDirection: 'row', justifyContent:'space-between', }}>
            <RaisedButton
              linkButton={true}
              label="Cancel"
              onClick={()=>{this._editSoftwareBlock(false)}}
              // onClick={this._handleLogin}
              style={{flexGrow:1, textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
            </RaisedButton>
            <RaisedButton
              linkButton={true}
              secondary={true}
              label="Upgrade & Restart"
              onClick={()=>{this._editSoftwareBlock(false)}}
              // onClick={this._handleLogin}
              style={{flexGrow:1, textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
            </RaisedButton>
          </div>
        </div>

    }

    return (
      <div>
        <Card style={{ paddingRight: '20px', paddingLeft: '20px', paddingTop: '20px' }}>
          { PlatformBlock }
          { softwareBlock }

          <h3 style={styles.h3}>Factory reset</h3>
          <p>Reset the device to its factory default settings.</p>
          <b>Important: This action will remove all your data and settings in the device.</b>
          <RaisedButton
            linkButton={true}
            secondary={true}
            label="Reset"
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
