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
  FlatButton
} = mui;
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;
var AppDispatcher = require('../dispatcher/appDispatcher');

@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      againPassword: '',
      showPassword: false,
      notPassPassword: false,
      modal: false,
      errorTitle: '',
      errorMsg: ''
    }
    this._handleResetPassword = this._handleResetPassword.bind(this);
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _handleResetPassword() {
    var _self = this;
    var password = this.state.password;

    if (password.length < 6) {
      // console.log(123123)
      return ;
    } else {
      return appAction.resetPassword('root', password, window.session)
      .then(function(){
        return AppDispatcher.dispatch({
          APP_PAGE: 'LOGIN',
          successMsg: __('You have set your password successfully, please sign in now.'),
          errorMsg: null
        });
      })
      .catch(function(err) {
        return ;
      });
    }
  }

  render() {
    if (this.state.showPassword) {
      var textType = 'text';
    } else {
      var textType = 'password';
    }

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

    return (
      <div style={ styles.frame }>
        <div style={ styles.block }>
          <img src={ Logo } style={ styles.img }/>
          <p style={{
            lineHeight: '22px',
            marginTop: '40px',
            fontFamily: 'RionaSansLight,Arial,Helvetica,sans-serif'
          }}>{__('Welcome to')} <b>LinkIt Smart 7688</b></p>
          <TextField
            hintText={ __('Input your Account') }
            ref="password"
            value="root (default)"
            disabled={ true }
            underlineFocusStyle={{ borderColor: Colors.amber700 }}
            style={ styles.basicWidth }
            floatingLabelStyle={{ color: 'rgba(0, 0, 0, 0.498039)' }}
            required
            minLength="6"
            floatingLabelText={__("Account")} />
          <TextField
            hintText={ __("Please set a password") }
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
          <RaisedButton
            linkButton={true}
            secondary={true}
            label={ __("Submit") }
            backgroundColor={ Colors.amber700 }
            onTouchTap={ this._handleResetPassword }
            style={ styles.basicWidth }>
          </RaisedButton>
        </div>
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
    justifyContent: 'center',
    flexDirection: 'column',
    width: '300px',
    alignItems: 'center'
  },
  basicWidth: {
    width: '100%',
    textAlign: 'center'
  }
};

export default loginComponent;
