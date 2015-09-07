import React from 'react';
import Radium from 'radium';
import mui from 'material-ui';
let {AppBar} = mui;
import Logo from '../../img/mediatek1.png';
var AppDispatcher  = require('../dispatcher/appDispatcher');
var ThemeManager = new mui.Styles.ThemeManager();

@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {};
    this._logOut = this._logOut.bind(this);
  }
  _logOut () {
    window.localStorage.removeItem('info');
    window.localStorage.removeItem('session');
    window.session = '';
    return AppDispatcher.dispatch({
      APP_PAGE: 'LOGIN',
      successMsg: null,
      errorMsg: null
    });
  }
  componentDidMount() {
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  render() {
    return (
      <div>
        <AppBar
          style={styles.bg}
          iconElementLeft={<img style={styles.img} src={Logo} />}
          iconElementRight={<a href="" onTouchTap={this._logOut} style={{ color: '#000', lineHeight: '45px', textDecoration: 'none'}}>Log out</a>}
        />
      </div>
    )
  }

}

loginComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};

var styles = {
  bg: {
    background: '#fff'
  },
  img: {
    width: '130px',
    marginTop: '15px'
  }
}

export default loginComponent;
