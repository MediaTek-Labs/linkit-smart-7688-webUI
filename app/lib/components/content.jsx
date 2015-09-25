import React from 'react';
import Radium from 'radium';
import mui from 'material-ui';
import Sysinfo from './sysinfo.jsx';
import Network from './network.jsx';

let { Tabs, Tab, TextField } = mui;
var ThemeManager = new mui.Styles.ThemeManager();
var Colors       = mui.Styles.Colors;
var AppActions   = require('../actions/appActions');

@Radium
export default class contentComponent extends React.Component {
  constructor(props) {
    super(props)
    this._handleTabsChangeNetWork = this._handleTabsChangeNetWork.bind(this);
    this._handleTabsChangeSYS = this._handleTabsChangeSYS.bind(this);
    this.state = { tabsValue: 'sysinfo', boardModel: '' };
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _handleTabsChangeNetWork(){
    this.setState({ tabsValue: 'network' });
  }

  _handleTabsChangeSYS(){
    this.setState({ tabsValue: 'sysinfo' });
  }

  componentWillMount() {
    var self = this;
    AppActions.loadModel(window.session)
    .then(function(data) {
      console.log(data.body.result[1])
      return self.setState({ boardModel: data.body.result[1].model });
    });
  }
  render() {
    return (
      <div key="mainBlock" style={ styles.block }>
        <header style={ styles.header }>
          <p style={ styles.welcomeTitle } key="welcome">{ __('Welcome to') } <b>{ this.state.boardModel }</b></p>
          <p style={[ styles.welcomeTitle, styles.welcomeTitleLine ]} key="advanced">{ __('For advanced network configuration, go to ') }<a style={{ color:'#00a1de', textDecoration: 'none' }} href="/cgi-bin/luci">OpenWrt</a>.</p>
        </header>
        <Tabs
          valueLink={{ value: this.state.tabsValue }}
          tabItemContainerStyle={{
            backgroundColor: Colors.amber700,
            borderRadius: '5px 5px 0px 0px'
          }}
          inkBarStyle={{
            backgroundColor: '#54EFE2'
          }}
          style={ styles.content }>
          <Tab
            label={ __('System information') }
            value="sysinfo"
            onClick={ this._handleTabsChangeSYS.bind(this) }>
            <Sysinfo boardInfo={ this.props.boardInfo } />
          </Tab>
          <Tab
            label={ __('Network') }
            value="network"
            onClick={ this._handleTabsChangeNetWork.bind(this) }>
            <Network boardInfo={ this.props.boardInfo } />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

contentComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};

var styles= {
  block: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    '@media (max-width: 760px)': {
      paddingLeft: '10px',
      paddingRight: '10px'
    },
    border: '1px solid #d1d2d3'
  },
  welcomeTitle: {
    lineHeight: '35px',
    '@media (max-width: 760px)': {
      width: '100%'
    }
  },
  welcomeTitleLine: {
    '@media (max-width: 760px)': {
      marginTop: '-20px'
    }
  },
  content: {
    maxWidth: '768px',
    width: '100%',
    paddingBottom: '30px'
  },
  header: {
    maxWidth: '768px',
    width: '100%',
    marginTop: '60px',
    display: 'flex',
    justifyContent: 'space-between',
    '@media (max-width: 760px)': {
      justifyContent: 'none',
      display: 'block'
    }
  }
}

export default contentComponent;

