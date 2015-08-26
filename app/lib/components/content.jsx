import React from 'react';
import Radium from 'radium';

import mui from 'material-ui';
let { Tabs, Tab, TextField} = mui;
var ThemeManager = new mui.Styles.ThemeManager();

import Sysinfo from './sysinfo.jsx';
import Network from './network.jsx';

@Radium
export default class contentComponent extends React.Component {
  constructor(props) {
    super(props)
    this._handleTabsChangeNetWork = this._handleTabsChangeNetWork.bind(this);
    this._handleTabsChangeSYS = this._handleTabsChangeSYS.bind(this);

    this.state = {tabsValue: 'sysinfo'};
  }

  componentDidMount() {
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  _handleTabsChangeNetWork(){
    this.setState({tabsValue: 'network'});
  }

  _handleTabsChangeSYS(){
    this.setState({tabsValue: 'sysinfo'});
  }

  render() {
    return (
      <div style={styles.block}>
        <header style={ styles.header }>
          <p style={{ lineHeight: '35px' }}> Welcome to <b>LinkIt Smart 7688</b></p>
          <p style={{ lineHeight: '35px' }}>For advanced network configuration, go to <a href="">OpenWrt</a>.</p>
        </header>
        <Tabs
          valueLink={{ value: this.state.tabsValue }}
          style={styles.content}>
          <Tab label="System information" value="sysinfo" onClick={this._handleTabsChangeSYS.bind(this)}>
            <Sysinfo />
          </Tab>
          <Tab label="Network" value="network" onClick={this._handleTabsChangeNetWork.bind(this)}>
            <Network />
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
    alignItems: 'center',
  },
  content: {
    width: '768px',
    paddingBottom: '30px'
  },
  header: {
    width: '768px',
    height: '64px',
    display: 'flex',
    justifyContent: 'space-between'
  }
}

export default contentComponent;

