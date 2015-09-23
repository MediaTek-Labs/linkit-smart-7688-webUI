import React from 'react';
import Radium from 'radium';

import mui from 'material-ui';
let {IconButton, FontIcon, List, ListItem} = mui;
var ThemeManager = new mui.Styles.ThemeManager();


@Radium
export default class loginComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
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
      <div>12312321</div>
    )
  }

}

loginComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};


export default loginComponent;
