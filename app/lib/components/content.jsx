import { default as React, PropTypes } from 'react';
import Radium from 'radium';
import mui from 'material-ui';
import Sysinfo from './sysinfo.jsx';
import Network from './network.jsx';
import AppActions from '../actions/appActions';

const { Tabs, Tab } = mui;
const ThemeManager = new mui.Styles.ThemeManager();
const Colors = mui.Styles.Colors;

const styles = {
  block: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    '@media (max-width: 760px)': {
      paddingLeft: '10px',
      paddingRight: '10px',
    },
    border: '1px solid #d1d2d3',
  },

  welcomeTitle: {
    lineHeight: '35px',
    '@media (max-width: 760px)': {
      width: '100%',
    },
  },

  welcomeTitleLine: {
    '@media (max-width: 760px)': {
      marginTop: '-20px',
    },
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
    justifyContent: 'space-between',
    '@media (max-width: 760px)': {
      justifyContent: 'none',
      display: 'block',
    },
  },
};

@Radium
export default class contentComponent extends React.Component {
  static propTypes = {
    boardInfo: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    children: PropTypes.node,
  }

  constructor(props) {
    super(props);
    this._handleTabsChangeNetWork = ::this._handleTabsChangeNetWork;
    this._handleTabsChangeSYS = ::this._handleTabsChangeSYS;
    this.state = {
      tabsValue: 'sysinfo',
      boardModel: '',
    };
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  }

  componentWillMount() {
    const this$ = this;
    AppActions.loadModel(window.session)
    .then((data) => {
      return this$.setState({ boardModel: data.body.result[1].model });
    });
  }

  render() {
    return (
      <div key="mainBlock" style={ styles.block }>
        <header style={ styles.header }>
          <p style={ styles.welcomeTitle } key="welcome">{ __('Welcome to') } <b>{ this.state.boardModel }</b></p>
          <p style={[ styles.welcomeTitle, styles.welcomeTitleLine ]} key="advanced">
            {
              __('For advanced network configuration, go to ')
            }<a style={{ color: '#00a1de', textDecoration: 'none' }} href="/cgi-bin/luci">OpenWrt</a>.
          </p>
        </header>
        <Tabs
          valueLink={{ value: this.state.tabsValue }}
          tabItemContainerStyle={{
            backgroundColor: Colors.amber700,
            borderRadius: '5px 5px 0px 0px',
          }}
          inkBarStyle={{
            backgroundColor: '#54EFE2',
          }}
          style={ styles.content }>
          <Tab
            label={ __('System information') }
            value="sysinfo"
            onClick={ ::this._handleTabsChangeSYS }>
            <Sysinfo boardInfo={ this.props.boardInfo } />
          </Tab>
          <Tab
            label={ __('Network') }
            value="network"
            onClick={ ::this._handleTabsChangeNetWork }>
            <Network boardInfo={ this.props.boardInfo } />
          </Tab>
        </Tabs>
      </div>
    );
  }

  _handleTabsChangeNetWork() {
    this.setState({ tabsValue: 'network' });
  }

  _handleTabsChangeSYS() {
    this.setState({ tabsValue: 'sysinfo' });
  }
}

contentComponent.childContextTypes = {
  muiTheme: React.PropTypes.object,
};

