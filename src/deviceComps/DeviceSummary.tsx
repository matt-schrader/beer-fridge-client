import React from 'react'
import { observer } from 'mobx-react';
import Device from '../model/Device';
import Card from '../components/Card';
import CardHeader from '../components/CardHeader';
import CardBody from '../components/CardBody';
import EditableText from '../components/form/EditableText';
import Big from '../components/Big'
import Little from '../components/Little'
import Flex from '../components/Flex';
import './DeviceSummary.css'
import Spacer from '../components/Spacer';
import SmallChart from './SmallChart';

interface Props {
    device: Device
    onSave: (device: Device) => void
}

interface State {
    editMode: boolean;
}

@observer
class DeviceSummary extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props)
        this.state = { editMode: false }
    }
    private handleEditName = (value: string) => {
        const { device, onSave } = this.props
        if (value !== device.id) {
            onSave({
                _id: device._id,
                name: value
            } as Device)
        }
    }

    private handleEditTarget = (value: string) => {
        const { device, onSave } = this.props
        if (value !== device.targetTemperatureDisplay) {
            onSave({
                _id: device._id,
                targetTemperature: device.parseRawTemp(value)
            } as Device)
        }
    }

    private handleEnterEdit = () => {
        const { editMode } = this.state
        this.setState({ editMode: !editMode })
    }

    private renderTarget() {
        const { editMode } = this.state
        const { device } = this.props
        if (editMode) {
            return (
                <Spacer padTop>Target: <EditableText editing={editMode} onEdit={this.handleEditTarget}>{device.targetTemperatureDisplay}</EditableText></Spacer>
            )
        }
        if (!device.isTempWithinRange) {
            return <Little padTop>Targeting {device.targetTemperatureDisplay}</Little>
        }
    }

    public render() {
        const { device } = this.props
        const { editMode } = this.state

        const powerIndicatorClass = device.currentState === "ON" ? 'on' : ''
        const showTarget = editMode || !device.isTempWithinRange
        return (
            <Card modal={editMode}>
                <CardHeader>
                    <Flex><EditableText editing={editMode} onEdit={this.handleEditName}>{device.name ? device.name : device.id}</EditableText></Flex>

                    <Spacer padRight padLeft><div onClick={this.handleEnterEdit}>{editMode ? 'X' : 'Edit'}</div></Spacer>
                    <div className={`powerIndicator ${powerIndicatorClass}`}></div>
                </CardHeader>
                <CardBody centered>
                    <Big>{device.currentTemperatureDisplay}</Big>
                    {!device.isTempWithinRange && <Little>Actual Temp</Little>}
                    {this.renderTarget()}
                    <SmallChart logs={device.lastHourTemperatureLog} />
                </CardBody>
            </Card>
        )
    }
}

export default DeviceSummary