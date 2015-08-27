import React from 'react';
import Radium from 'radium';
import mui from 'material-ui';
let {RefreshIndicator} = mui;
var ThemeManager = new mui.Styles.ThemeManager();

@Radium
export default class loadingComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {};
  }

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  }

  render() {
    return (
      <div style={styles.bg}>
        <div style={styles.block}>
          <RefreshIndicator size={40} style={{top: '50%', left: '50%', marginLeft:'-20px', marginTop: '-20px', zIndex: 9}} status="loading" />
        </div>
        <div style={ styles.mask }></div>
      </div>
    )
  }

}

loadingComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};

var styles = {
  bg: {
    position: 'fixed',
    width: '100%',
    zIndex: 9,
    height: '100%',
  },
  block: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  mask: {
    background: '#f1f1f1',
    width: '100%',
    height: '100%',
    top: '0',
    position: 'fixed',
    opacity: 0.6
  },
  img: {
    width: '130px',
    marginTop: '15px'
  }
}

export default loadingComponent;
