import { default as React } from 'react';
import Radium from 'radium';
import Logo from '../../img/mediatek.png';
import mui from 'material-ui';
import appAction from '../actions/appActions';
import AppDispatcher from '../dispatcher/appDispatcher';

const {
  RaisedButton,
  TextField,
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

  img: {
    width: '200px',
  },

  block: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '300px',
    alignItems: 'center',
  },

  basicWidth: {
    width: '100%',
    textAlign: 'center',
  },

};

@Radium
export default class resetPasswordComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      againPassword: '',
      showPassword: false,
      notPassPassword: false,
      modal: false,
      errorTitle: '',
      errorMsg: '',
    };
    this._handleResetPassword = ::this._handleResetPassword;
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  render() {
    let textType = 'password';
    let errorText;
    let showPasswordStyle = {
      width: '100%',
      marginBottom: '44px',
    };

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
          }}>{ __('Please use at least 6 alphanumeric characters.') }</p>
        </div>
      );
      showPasswordStyle = {
        marginTop: '20px',
        width: '100%',
        marginBottom: '44px',
      };
    }

    return (
      <div style={ styles.frame }>
        <div style={ styles.block }>
          <img src={ Logo } style={ styles.img }/>
          <p style={{
            lineHeight: '22px',
            marginTop: '40px',
            fontFamily: 'RionaSansLight,Arial,Helvetica,sans-serif',
          }}>{__('Welcome to')} <b>LinkIt Smart 7688</b></p>
          <p style={{ color: '#69BE28', marginTop: '-10px' }}>{__('Please set a password.')}</p>
          <TextField
            hintText={ __('Input your Account') }
            ref="password"
            value="root (default)"
            disabled
            underlineFocusStyle={{ borderColor: Colors.amber700 }}
            style={ styles.basicWidth }
            floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
            required
            minLength="6"
            floatingLabelText={__('Account')} />
          <TextField
            hintText={ __('Please set a password') }
            type={ textType }
            floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
            underlineFocusStyle={{ borderColor: Colors.amber700 }}
            errorStyle={{ borderColor: Colors.amber700 }}
            style={ styles.basicWidth }
            required
            minLength="6"
            onChange={
              (e) => {
                if (e.target.value.length < 6) {
                  this.setState({ notPassPassword: true, password: e.target.value });
                } else {
                  this.setState({ password: e.target.value, notPassPassword: false });
                }
              }
            }
            errorText={ errorText }
            floatingLabelText=
            {
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
          <RaisedButton
            linkButton
            secondary
            label={ __('Submit') }
            backgroundColor={ Colors.amber700 }
            onTouchTap={ this._handleResetPassword }
            style={ styles.basicWidth } />
        </div>
      </div>
    );
  }

  _handleResetPassword() {
    const password = this.state.password;

    if (password.length < 6) {
      return false;
    }

    return appAction.resetPassword('root', password, window.session)
    .then(() => {
      return AppDispatcher.dispatch({
        APP_PAGE: 'LOGIN',
        successMsg: __('You have set your password successfully, please sign in now.'),
        errorMsg: null,
      });
    })
    .catch(() => {
      return;
    });
  }
}

resetPasswordComponent.childContextTypes = {
  muiTheme: React.PropTypes.object,
};

