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
      showPassword: false
    }

    this._handleLogin = this._handleLogin.bind(this)
  }

  componentDidMount() {
    if (this.props.errorMsg === 'Waiting') {
      this.state.waiting = true;
      this.refs.waitingDialog.show();
    } else {
      this.state.waiting = false;
      this.refs.waitingDialog.dismiss();
    }
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
    return (
      <div style={styles.frame}>
        <Dialog
          title={__("Connection failed...")}
          ref="waitingDialog"
          modal={ this.state.waiting }>
          <p style={{ lineHeight: '23px'}}>{__('Please refresh. If problem persists, please ensure your board is not in the process of rebooting, or updating new firmware, or check Wi-Fi connectivity settings.')}</p>
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
              marginTop: '40px' 
            }}>{__('Welcome to')} <b>LinkIt Smart 7688</b>.</p>
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
                  cursor: 'pointer' 
                }}>{__('SHOW PASSWORD')}</a>
            </div>
            <br />
            <RaisedButton
              linkButton={true}
              secondary={true}
              label="Sign in"
              backgroundColor={ Colors.amber700 }
              onTouchTap={ this._handleLogin }
              style={ styles.basicWidth }>
              <FontIcon 
                style={ styles.exampleButtonIcon } 
                className="muidocs-icon-custom-github"/>
            </RaisedButton>
          </div>
          <p style={{ 
            marginTop: '80px', 
            borderTop: '1px solid rgba(0,0,0,0.12)', 
            paddingTop: '10px'
          }} >{__('For advanced network configuration, go to ')}<a style={{ color:'#00a1de', textDecoration: 'none' }} href="/cgi-bin/luci">OpenWrt</a>.</p>
        </div>
        <Snackbar 
          message="Event added to your calendar"
          action="undo"
          autoHideDuration={this.state.autoHideDuration} />
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
