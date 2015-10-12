import { default as React, PropTypes } from 'react';
import Radium from 'radium';
import Logo from '../../img/mediatek.png';
import mui from 'material-ui';
import appAction from '../actions/appActions';

const {
  RaisedButton,
  FontIcon,
  TextField,
  Dialog,
  Snackbar,
} = mui;

const ThemeManager = new mui.Styles.ThemeManager();
const Colors = mui.Styles.Colors;
const styles = {
  frame: {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  panelTitle: {
    width: '100%',
    tapHighlightColor: 'rgba(0,0,0,0)',
    color: 'rgba(0, 0, 0, 0.498039)',
    fontSize: '16px',
    transform: 'perspective(1px) scale(0.75) translate3d(0px, -28px, 0)',
    transformOrigin: 'left top',
    marginBottom: '0px',
    marginTop: '40px',
  },

  panelContent: {
    width: '100%',
    borderBottom: '1px solid #D1D2D3',
    fontSize: '16px',
    marginTop: '-15px',
    paddingBottom: '5px',
  },

  img: {
    width: '200px',
  },

  block: {
    display: 'flex',
    width: '420px',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },

  basicWidth: {
    width: '100%',
    textAlign: 'center',
  },
};

@Radium
export default class loginComponent extends React.Component {
  static propTypes = {
    errorMsg: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    successMsg: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  }
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      showPassword: false,
      autoHideDuration: 3000,
      successMsg: this.props.successMsg,
    };

    this._handleLogin = ::this._handleLogin;
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

    const this$ = this;
    document.addEventListener('keypress', (e)=> {
      const key = e.which || e.keyCode;
      if (key === 13) { // 13 is enter
        return this$._handleLogin();
      }
    });
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  render() {
    let textType = 'password';
    if (this.state.showPassword) {
      textType = 'text';
    }
    let dialogMsg;
    if (this.state.successMsg) {
      dialogMsg = (
        <div style={{
          width: '100%',
          position: 'fixed',
          display: 'flex',
          left: '0px',
          bottom: '0px',
          justifyContent: 'center',
        }}>
          <Snackbar
            style={{
              fontSize: '14px',
              height: 'none',
              minHeight: '48px',
              bottom: '0px',
              margin: '0 auto',
              position: 'relative',
            }}
            message={ this.state.successMsg }
            ref="snackbar"
            autoHideDuration={this.state.autoHideDuration} />
        </div>
      );
    }
    return (
      <div style={styles.frame}>
        <Dialog
          title={__('Connection failed...')}
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
            alignItems: 'center',
          }}>
            <img src={ Logo } style={ styles.img } />
            <p style={{
              lineHeight: '22px',
              marginTop: '40px',
              fontFamily: 'RionaSansLight,Arial,Helvetica,sans-serif',
            }}><span style={{fontFamily: 'RionaSansLight,Arial,Helvetica,sans-serif'}}>{__('Welcome to')}</span> <b style={{ fontFamily: 'RionaSansMedium,Arial,Helvetica,sans-serif' }}>LinkIt Smart 7688</b>.</p>
            <h3 style={ styles.panelTitle }>{__('Account')}</h3>
            <p style={ styles.panelContent }>root(default)</p>
            <TextField
              hintText={ __('Please enter your password') }
              type={ textType }
              floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
              underlineFocusStyle={{ borderColor: Colors.amber700 }}
              style={[styles.basicWidth, { marginTop: '-10px' }]}
              onChange={
                (e)=> {
                  this.setState({ password: e.target.value });
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
                  ()=> {
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
            <br />
            <RaisedButton
              linkButton
              secondary
              label={ __('Sign in') }
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
              textAlign: 'center',
            }} >{ __('For advanced network configuration, go to ') }<a style={{ color: '#00a1de', textDecoration: 'none' }} href="/cgi-bin/luci">OpenWrt</a>.</p>
          </div>
        </div>
        { dialogMsg }
      </div>
    );
  }

  _handleLogin() {
    const password = this.state.password;
    return appAction.login('root', password);
  }
}

loginComponent.childContextTypes = {
  muiTheme: React.PropTypes.object,
};
