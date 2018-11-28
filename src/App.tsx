import React from 'react';
import './App.css';
import { observer } from 'mobx-react';
import DeviceSummaryList from './deviceComps/DeviceSummaryList';

interface State {
  mobile?: boolean
}

class App extends React.Component<{}, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      mobile: window.innerWidth < 600
    }

    window.onresize = () => {
      this.setState({
        mobile: window.innerWidth < 600
      })
    }
  }
  render() {
    const { mobile } = this.state
    const classes = `App ${mobile ? 'Mobile' : ''}`
    return (
      <div className={classes}>
        <DeviceSummaryList />
      </div>
    );
  }
}

export default observer(App);
