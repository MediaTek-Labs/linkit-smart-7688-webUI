import React from 'react';
import Radium from 'radium';
import Logo from '../../img/mediatek.png';
import mui from 'material-ui';
import appAction from '../actions/appActions';
let {RaisedButton, FontIcon, TextField} = mui;
var ThemeManager = new mui.Styles.ThemeManager();

@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this._handleLogin = this._handleLogin.bind(this)
  }

  componentDidMount() {

  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _handleLogin() {
    return appAction.login();
  }

  render() {
    return (
      <div style={styles.frame}>
        <div style={styles.block}>
          <img src={Logo} style={styles.img}/>
          <p>Welcome to MyLinkIt, please input password to access the web console.</p>
          <TextField
            hintText="Input your password"
            type="password"
            style={ styles.basicWidth }
            floatingLabelText="Password" />
          <br />
          <RaisedButton
            linkButton={true}
            secondary={true}
            label="Login"
            onClick={this._handleLogin}
            style={styles.basicWidth}>
            <FontIcon style={styles.exampleButtonIcon} className="muidocs-icon-custom-github"/>
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
    marginBottom: '50px'
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
