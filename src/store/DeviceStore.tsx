import _ from 'lodash'
import moment from 'moment'
import { observable } from 'mobx'
import featherClient from '../service/FeatherService'
import Device from '../model/Device'
import { Application, Service, Paginated } from '@feathersjs/feathers';

export class DeviceStore {
  private deviceService: Service<any>
  private temperatureLogService: Service<any>
  @observable devices: Array<Device> = []

  public constructor(feathers: Application<object>) {
    this.deviceService = feathers.service('device')
    this.deviceService.on('patched', this.updateDevice)
    this.deviceService.on('updated', this.updateDevice)
    this.deviceService.on('created', this.updateDevice)

    this.temperatureLogService = feathers.service('temperature-log')
    this.temperatureLogService.on('created', this.temperatureLogged)

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

  private temperatureLogged = (tempLog: any) => {
    if (tempLog && tempLog.deviceId) {
      const deviceIdx = _.findIndex(this.devices, nextDevice => nextDevice.id === tempLog.deviceId)
      this.devices[deviceIdx].logTemp(tempLog)
    }
  }

  private async initDevices() {
    const devices = await this.deviceService.find() as Array<Device>
    this.devices = await Promise.all(_.map(_.orderBy(devices, ['name', 'id']), async (nextDevice) => {
      const device = this.createDevice(nextDevice)
      const startTime = moment.utc().subtract(1, 'hour').format()
      const deviceTemps: Paginated<any> = await this.temperatureLogService.find({
        query: {
          deviceId: device.id,
          time: {
            $gte: startTime
          },
          $sort: {
            time: 1
          },
          $limit: 100
        }
      }) as Paginated<any>
      console.log(deviceTemps)
      for (const log of deviceTemps.data) {
        console.log(log)
        device.logTemp(log)
      }
      return device
    }))
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