import React from 'react';
import Radium from 'radium';
import Logo from '../../img/mediatek.png';
import mui from 'material-ui';
import appAction from '../actions/appActions';
let {RaisedButton, FontIcon, TextField, Dialog} = mui;
var ThemeManager = new mui.Styles.ThemeManager();

@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      password: ''
    }

    this._handleLogin = this._handleLogin.bind(this)
  }

  componentDidMount() {
    console.log(this.props.errorMsg)
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
    var password = this.state.password
    return appAction.login('root', password);
  }

  render() {
    return (
      <div style={styles.frame}>
        <Dialog
          title="Connection failed..."
          ref="waitingDialog"
          modal={ this.state.waiting }>
          <p>Please refresh. If problem persists, please ensure your board is not in the process of updating new firmware, or check Wi-Fi connectivity settings.</p>
        </Dialog>
        <div style={styles.block}>
          <img src={Logo} style={styles.img}/>
          <p style={{lineHeight: '22px'}}>Welcome to MyLinkIt, please input password to access the web console.</p>
          <TextField
            hintText="Input your Account"
            ref="password"
            value="root (default)"
            style={ styles.basicWidth }
            required
            minLength="6"
            floatingLabelText="Account" />
          <TextField
            hintText="Input your password"
            type="password"
            ref="password"
            style={ styles.basicWidth }
            onChange={
              (e) => {
                this.setState({password:e.target.value});
              }
            }
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
          <p style={{marginTop: '50px'}}>For advanced network configuration, go to <a href="">OpenWrt</a>.</p>
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
