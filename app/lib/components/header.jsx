import React from 'react';
import Radium from 'radium';
import mui from 'material-ui';
let {
  AppBar, 
  Card,
  DropDownMenu
} = mui;
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
    if (/zh\-tw/.test(window.location.pathname)) {
      this.state.language = '2';
    } else if (/zh\-cn/.test(window.location.pathname)) {
      this.state.language = '3';
    } else {
      this.state.language = '1';
    }
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
    let menuItems = [
      { payload: '1', text: 'English' },
      { payload: '2', text: '繁體中文' },
      { payload: '3', text: '简体中文' },
    ];

    var defaultRouter = '';
    if (/127.0.0.1/.test(window.location.host)) {
      defaultRouter = '/app';
    }

    return (
      <div>
        <header style={ styles.header }>
          <div style={ styles.container }>
            <img style={ styles.img } src={ Logo } />
            <div style={{ display: 'flex' }}>
              <DropDownMenu 
                menuItems={menuItems} 
                value={this.state.language}
                style={{ width: '130px', borderBottom: '0px' }} 
                onChange={
                  (e, sel, item)=>{
                    switch(sel) {
                      case 0:
                        console.log('en')
                        window.location.href = defaultRouter + '/';
                        break;
                      case 1: 
                        window.location.href = defaultRouter + '/zh-tw.html';
                        break;
                      case 2:
                        window.location.href = defaultRouter + '/zh-cn.html';
                        break;
                    }
                  }
                }
                labelStyle={{ 
                  color: Colors.amber700, 
                  lineHeight: '63px', 
                  fontSize: '16px' }} 
                underlineStyle={{ border: '0px' }}/>
              <a onTouchTap={this._logOut} style={{ color: Colors.amber700, textDecoration: 'none', cursor: 'pointer' }}>Sign out</a>
            </div>
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
