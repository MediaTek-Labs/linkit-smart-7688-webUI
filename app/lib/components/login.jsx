import React from 'react';
import Radium from 'radium';
import Logo from '../../img/mediatek.png';
import mui from 'material-ui';
import appAction from '../actions/appActions';
let {
  RaisedButton, 
  FontIcon, 
  TextField, 
  Dialog,
  Snackbar
} = mui;
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      showPassword: false,
      autoHideDuration: 3000,
      successMsg: this.props.successMsg
    }

    this._handleLogin = this._handleLogin.bind(this);
  }

  componentDidMount() {
    if (this.props.errorMsg === 'Waiting') {
      this.state.waiting = true;
      this.refs.waitingDialog.show();
    } else {
      this.state.waiting = false;
      this.refs.waitingDialog.dismiss();
    }

    if (this.state.successMsg) {
      this.refs.snackbar.show();  
    }
    var _this = this;
    document.addEventListener('keypress', function (e) {
      var key = e.which || e.keyCode;
      if (key === 13) { // 13 is enter
        return _this._handleLogin()
      }
    })
    
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _handleLogin() {
    var password = this.state.password;
    return appAction.login('root', password);
  }

  render() {
    if (this.state.showPassword) {
      var textType = 'text';
    } else {
      var textType = 'password';
    }
    if (this.state.successMsg) {
      var dialogMsg = 
        <div style={{ 
          width: '100%',
          position: 'fixed', 
          display: 'flex',
          left:'0px',
          bottom: '0px',
          justifyContent: 'center' 
        }}>
          <Snackbar 
            style={{ fontSize: '14px', height: 'none', minHeight: '48px', bottom: '0px', margin:'0 auto', position: 'relative' }}
            message={ this.state.successMsg }
            ref="snackbar"
            autoHideDuration={this.state.autoHideDuration} />
        </div>
    } else {
      var dialogMsg;
    }
    return (
      <div style={styles.frame}>
        <Dialog
          title={__("Connection failed...")}
          ref="waitingDialog"
          modal={ this.state.waiting }>
          <p style={{ lineHeight: '23px', marginTop: '-10px' }}>{__('Please refresh. If problem persists, please ensure your board is not in the process of rebooting, or updating new firmware, or check Wi-Fi connectivity settings.')}</p>
        </Dialog>
        <div style={ styles.block }>
          <div style={{ 
            width: '300px', 
            paddingLeft: '60px', 
            paddingRight: '60px',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center' 
          }}>
            <img src={ Logo } style={ styles.img }/>
            <p style={{ 
              lineHeight: '22px', 
              marginTop: '40px',
              fontFamily: 'RionaSansLight,Arial,Helvetica,sans-serif'
            }}><span style={{fontFamily: 'RionaSansLight,Arial,Helvetica,sans-serif'}}>{__('Welcome to')}</span> <b style={{ fontFamily: 'RionaSansMedium,Arial,Helvetica,sans-serif' }}>LinkIt Smart 7688</b>.</p>
            <TextField
              hintText={__("Input your Account")}
              color={ Colors.amber700 }
              value="root (default)"
              style={ styles.basicWidth }
              underlineFocusStyle={{ borderColor: Colors.amber700 }}
              required
              minLength="6"
              floatingLabelText={__("Account")} />
            <TextField
              hintText={__("Please enter your password")}
              type={ textType }
              floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
              underlineFocusStyle={{ borderColor: Colors.amber700 }}
              style={ styles.basicWidth }
              onChange={
                (e) => {
                  this.setState({password:e.target.value});
                }
              }
              floatingLabelText=
                {
                  <div>
                    {__('Password')} <b style={{ color: 'red' }}>*</b>
                  </div>
                } />
            <div style={{ width: '100%', marginBottom: '24px' }}>
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
                }}>{__('SHOW PASSWORD')}</a>
            </div>
            <br />
            <RaisedButton
              linkButton={true}
              secondary={true}
              label={__("Sign in")}
              backgroundColor={ Colors.amber700 }
              onTouchTap={ this._handleLogin }
              type="submit"
              style={ styles.basicWidth }>
              <FontIcon 
                style={ styles.exampleButtonIcon } 
                className="muidocs-icon-custom-github" />
            </RaisedButton>
          </div>
          <div style={{width: '100%'}}>
            <p style={{ 
              marginTop: '80px', 
              borderTop: '1px solid rgba(0,0,0,0.12)', 
              paddingTop: '10px',
              textAlign: 'center'
            }} >{__('For advanced network configuration, go to ')}<a style={{ color:'#00a1de', textDecoration: 'none' }} href="/cgi-bin/luci">OpenWrt</a>.</p>
          </div>
        </div>
        { dialogMsg }
      </div>
    )
  }

}

loginComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};

var styles = {
  frame: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    width:'200px'
  },
  block: {
    display: 'flex',
    width: '420px',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  basicWidth: {
    width: '100%',
    textAlign: 'center'
  }
};

export default loginComponent;
