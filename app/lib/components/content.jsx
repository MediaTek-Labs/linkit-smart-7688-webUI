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
    this.state = {};
    this._handleTabActive = this._handleTabActive.bind(this);
    // this.state.wifi = []
  }

  componentDidMount() {
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }
  _handleTabActive() {

  }
  render() {
    return (
      <div style={styles.block}>
        <header style={styles.header}>
          <p> Welcome to <b>LinkIt Smart 7688</b></p>
          <p>For advanced network configuration, go to <a href="">OpenWrt</a>.</p>
        </header>
        <Tabs style={styles.content}>
          <Tab label="System information" >
            <Network />
          </Tab>
          <Tab label="Network" >
            (Tab content...123123)
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
    display: 'flex',
    justifyContent: 'space-between'
  }
}

export default contentComponent;

