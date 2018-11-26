import React from 'react';
import './App.css';
import { observer } from 'mobx-react';
import DeviceSummaryList from './deviceComps/DeviceSummaryList';

const App = () => {
  return (
    <div className="App">
      <DeviceSummaryList />
    </div>
  );
}

export default observer(App);
