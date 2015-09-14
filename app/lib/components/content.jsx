import React from 'react';
import Radium from 'radium';

import mui from 'material-ui';
let { Tabs, Tab, TextField} = mui;
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

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
          <p style={{ lineHeight: '35px' }}>{__('Welcome to')} <b>LinkIt Smart 7688</b></p>
          <p style={{ lineHeight: '35px' }}>{__('For advanced network configuration, go to ')}<a style={{ color:'#00a1de', textDecoration: 'none' }} href="/cgi-bin/luci">OpenWrt</a>.</p>
        </header>
        <Tabs
          valueLink={{ value: this.state.tabsValue }}
          tabItemContainerStyle={{ backgroundColor: Colors.amber700 }}
          style={styles.content}>
          <Tab
            label={__("System information")}
            value="sysinfo"
            onClick={this._handleTabsChangeSYS.bind(this)}>
            <Sysinfo boardInfo={ this.props.boardInfo } />
          </Tab>
          <Tab 
            label={__("Network")} 
            value="network" 
            onClick={this._handleTabsChangeNetWork.bind(this)}>
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
  },
  content: {
    maxWidth: '768px',
    width: '100%',
    paddingBottom: '30px',
  },
  header: {
    maxWidth: '768px',
    width: '100%',
    marginTop: '60px',
    display: 'flex',
    justifyContent: 'space-between'
  }
}

export default contentComponent;

