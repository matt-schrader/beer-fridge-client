import React from 'react'
import _ from 'lodash'
import { observer } from 'mobx-react';
import DeviceSummary from './DeviceSummary';
import deviceStore from '../store/DeviceStore'
import Row from '../components/Row';
import Device from '../model/Device';

@observer
class DeviceSummaryList extends React.Component<{}, {}> {
    private saveDevice = (device: Device) => {
        deviceStore.saveDevice(device)
    }

    public render() {
        return (
            <Row>
                {_.map(deviceStore.devices, nextDevice => <DeviceSummary key={nextDevice._id} device={nextDevice} onSave={this.saveDevice} />)}
            </Row>
        )
    }
}

export default DeviceSummaryList