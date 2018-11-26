import _ from 'lodash'
import { observable } from 'mobx'
import featherClient from '../service/FeatherService'
import Device from '../model/Device'
import { Application, Service } from '@feathersjs/feathers';

export class DeviceStore {
  private deviceService: Service<any>
  @observable devices: Array<Device> = []

  public constructor(feathers: Application<object>) {
    this.deviceService = feathers.service('device')
    this.deviceService.on('patched', this.updateDevice)
    this.deviceService.on('updated', this.updateDevice)

    this.initDevices()
  }

  private updateDevice = (device: any) => {
    const deviceIdx = _.findIndex(this.devices, nextDevice => nextDevice.id === device.id)
    if (deviceIdx >= 0) {
      this.devices[deviceIdx].fromJson(device)
    } else {
      this.devices = [
        ...this.devices,
        this.createDevice(device)
      ]
      this.devices = _.orderBy(this.devices, ['name', 'id'])
    }
  }

  private createDevice(json: any) {
    const deviceModel = new Device()
    deviceModel.fromJson(json)
    return deviceModel
  }

  private async initDevices() {
    const devices = await this.deviceService.find() as Array<Device>
    this.devices = _.map(_.orderBy(devices, ['name', 'id']), device => {
      return this.createDevice(device)
    })
  }

  public saveDevice(device: Device) {
    if (!device._id) {
      throw new Error("_id is required")
    }
    const existingDevice = _.find(this.devices, next => next._id === device._id)
    this.deviceService.patch(device._id, {
      ...device,
      version: existingDevice && existingDevice.version ? existingDevice.version + 1 : 1
    })
  }
}

export default new DeviceStore(featherClient)