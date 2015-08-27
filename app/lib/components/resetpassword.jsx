import React from 'react';
import Radium from 'radium';
import Logo from '../../img/mediatek.png';
import mui from 'material-ui';
import appAction from '../actions/appActions';
let {RaisedButton, FontIcon, TextField} = mui;
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;
var AppDispatcher = require('../dispatcher/appDispatcher');

@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      againPassword: ''
    }
    this._handleResetPassword = this._handleResetPassword.bind(this)
  }

  componentDidMount() {

  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _handleResetPassword() {
    var password = this.state.password;
    var againPassword = this.state.againPassword;

    if (password.length < 6) {
      return alert('Password length must more than 6.');
    }

    if (password !== againPassword) {
      return alert('Password does not match confirmation.');
    }

    return appAction.resetPassword('root', password, window.session)
    .then(function(){
      return AppDispatcher.dispatch({
        APP_PAGE: 'LOGIN',
        successMsg: null,
        errorMsg: null
      });
    })
    .catch(function(err) {
      alert(err);
    });
  }

  render() {
    return (
      <div style={styles.frame}>
        <div style={styles.block}>
          <img src={Logo} style={styles.img}/>
          <p style={{lineHeight: '22px'}}>Welcome to <b>LinkIt Smart 7688</b>, please setup your password at first.</p>
          <TextField
            hintText="Input your Account"
            ref="password"
            value="root (default)"
            underlineFocusStyle={{borderColor: Colors.amber700}}
            floatingLabelStyle={{color: Colors.amber700}}
            style={ styles.basicWidth }
            required
            minLength="6"
            floatingLabelText="Account" />
          <TextField
            hintText="Input your password"
            type="password"
            underlineFocusStyle={{borderColor: Colors.amber700}}
            floatingLabelStyle={{color: Colors.amber700}}
            style={ styles.basicWidth }
            required
            minLength="6"
            onChange={
              (e) => {
                this.setState({password: e.target.value});
              }
            }
            floatingLabelText="Password" />
          <TextField
            hintText="Please input your password again"
            type="password"
            required
            underlineFocusStyle={{borderColor: Colors.amber700}}
            floatingLabelStyle={{color: Colors.amber700}}
            style={ styles.basicWidth }
            onChange={
              (e) => {
                this.setState({againPassword: e.target.value});
              }
            }
            floatingLabelText="Confirm the password" />
          <br />
          <RaisedButton
            linkButton={true}
            secondary={true}
            label="Submit"
            backgroundColor={Colors.amber700}
            onClick={this._handleResetPassword}
            style={styles.basicWidth}>
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
    marginBottom: '10px',
    width:'200px'
  },
  block: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    width: '350px',
    alignItems: 'center'
  },
  basicWidth: {
    width: '100%',
    textAlign: 'center'
  }
};

export default loginComponent;
