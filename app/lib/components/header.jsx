import { default as React } from 'react';
import Radium from 'radium';
import mui from 'material-ui';
import Logo from '../../img/mediatek.png';

const {
  DropDownMenu,
} = mui;

import AppDispatcher from '../dispatcher/appDispatcher';
const ThemeManager = new mui.Styles.ThemeManager();
const Colors = mui.Styles.Colors;
const styles = {
  bg: {
    background: '#fff',
  },

  img: {
    width: '130px',
    marginTop: '15px',
  },

  header: {
    width: '100%',
    height: '60px',
    boxSizing: 'border-box',
    tapHighlightColor: 'rgba(0,0,0,0)',
    zIndex: 99,
    position: 'fixed',
    background: '#fff',
    boxShadow: '1px 2px 1px 0 rgba(0,0,0,0.1), 0 0 0 rgba(0,0,0,0.1)',
  },

  container: {
    display: 'flex',
    flexDirection: 'row',
    height: '45px',
    lineHeight: '60px',
    justifyContent: 'space-between',
    maxWidth: '768px',
    margin: '0 auto',
    '@media (max-width: 760px)': {
      paddingLeft: '10px',
      paddingRight: '10px',
    },
  },
};

@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props);
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

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  componentWillMount() {
    ThemeManager.setComponentThemes({
      textField: {
        borderColor: Colors.amber700,
      },
      menuItem: {
        selectedTextColor: Colors.amber700,
      },
    });
  }

  render() {
    const menuItems = [
      { payload: '1', text: 'English' },
      { payload: '2', text: '繁體中文' },
      { payload: '3', text: '简体中文' },
    ];

    let defaultRouter = '';

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
                menuItems={ menuItems }
                value={ this.state.language }
                style={{ width: '130px', borderBottom: '0px' }}
                onChange={
                  (e, sel)=> {
                    switch (sel) {
                    case 1:
                      window.location.href = defaultRouter + '/zh-tw.html';
                      break;
                    case 2:
                      window.location.href = defaultRouter + '/zh-cn.html';
                      break;
                    default:
                      window.location.href = defaultRouter + '/';
                      break;
                    }
                  }
                }
                labelStyle={{
                  color: Colors.amber700,
                  lineHeight: '60px',
                  fontSize: '16px' }}
                underlineStyle={{ border: '0px' }}/>
              <a
                onTouchTap={ this._logOut }
                style={{
                  color: Colors.amber700,
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}>{ __('Sign out') }</a>
            </div>
          </div>
        </header>
      </div>
    );
  }

  _logOut() {
    window.localStorage.removeItem('info');
    window.localStorage.removeItem('session');
    window.session = '';
    return AppDispatcher.dispatch({
      APP_PAGE: 'LOGIN',
      successMsg: null,
      errorMsg: null,
    });
  }
}

loginComponent.childContextTypes = {
  muiTheme: React.PropTypes.object,
};
