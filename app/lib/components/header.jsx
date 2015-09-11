import React from 'react';
import Radium from 'radium';
import mui from 'material-ui';
let {AppBar, Card} = mui;
import Logo from '../../img/mediatek.png';
var AppDispatcher  = require('../dispatcher/appDispatcher');
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

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
  // <AppBar
  //         style={ styles.bg }
  //         iconElementLeft={
  //           <img style={ styles.img } src={ Logo } />
  //         }
  //         iconElementRight={
  //           <a href="" onTouchTap={this._logOut} style={{ color: '#000', lineHeight: '45px', textDecoration: 'none'}}>Log out</a>
  //         }/>
  render() {
    return (
      <div>
        <header style={ styles.header }>
          <div style={ styles.container }>
            <img style={ styles.img } src={ Logo } />
            <a href="" style={{ color: Colors.amber700, textDecoration: 'none' }}>Sign out</a>
          </div>
        </header>
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
  },
  header: {
    width: '100%',
    height: '60px',
    boxSizing: 'border-box',
    tapHighlightColor: 'rgba(0,0,0,0)',
    zIndex: 99,
    position: 'fixed',
    background: '#fff',
        // -webkit-tap-highlight-color: rgba(0,0,0,0);
    boxShadow: '1px 2px 1px 0 rgba(0,0,0,0.1), 0 0 0 rgba(0,0,0,0.1)'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '45px',
    lineHeight: '60px',
    justifyContent: 'space-between',
    width: '768px',
    margin: '0 auto'
  }
}

export default loginComponent;
