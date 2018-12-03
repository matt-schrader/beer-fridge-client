import { observable, computed } from 'mobx'
import _ from 'lodash'
import appStore, { TemperatureUnit } from '../store/AppStore'
import moment from 'moment'

export default class Device {
    public _id: string = ""
    public id: string = ""
    @observable name: string = ""
    @observable currentTemperature: number = -1
    @observable targetTemperature?: number = -1
    @observable currentState: string = ""
    @observable temperatureLogs: Array<any> = []
    version: number = 0

    fromJson(json: any) {
        this._id = json._id
        this.id = json.id
        this.name = json.name
        this.currentTemperature = json.currentTemperature
        this.targetTemperature = json.targetTemperature
        this.currentState = json.currentState
        this.version = json.version
    }

    @computed get isTempWithinRange() {
        return this.targetTemperature && this.currentTemperature < this.targetTemperature + 1 &&
            this.currentTemperature > this.targetTemperature - 1
    }

    @computed get currentTemperatureDisplay() {
        return this.formatTemp(appStore.temperatureUnit, this.currentTemperature, 2)
    }

    @computed get targetTemperatureDisplay() {
        return this.formatTemp(appStore.temperatureUnit, this.targetTemperature)
    }

    @computed get lastHourTemperatureLog() {
        const startTime = moment.utc().subtract('hour', 1)
        return this.temperatureLogs.slice().sort((left: any, right: any) => moment(left.time).diff(right)).filter((value: any) => startTime.isBefore(value.time)).map((value) => {
            return {
                deviceId: value.deviceId,
                time: value.time,
                temperature: this.convertTemp(appStore.temperatureUnit, value.temperature)
            }
        })
    }

    public logTemp(tempLog: any) {
        this.temperatureLogs.push({
            deviceId: tempLog.deviceId,
            time: tempLog.time,
            temperature: parseFloat(tempLog.temperature)
        })
    }

    private convertTemp(unit: TemperatureUnit, temperature: number) {
        let value = temperature
        if (unit === TemperatureUnit.Fahrenheit) {
            value = (value * 9/5) + 32
        }
        return value
    }

    private formatTemp(unit: TemperatureUnit, temperature?: number, decimalPlaces?: number) {
        if (temperature === undefined) {
            return '-'
        }

        let value = this.convertTemp(unit, temperature)
        let valueString = `${value}`
        valueString = decimalPlaces ? parseFloat(valueString).toFixed(decimalPlaces) : valueString
        return `${valueString}${appStore.temperatureUnit === TemperatureUnit.Celsius ? 'C' : 'F'}`
    }

    private isFormattedValue(formatted: string) {
        const value = this.getTempValueOnly(formatted);
        return _.isNumber(value)
    }

    private getTempValueOnly(formatted: string) {
        return _.toNumber(formatted.trim().substring(0, formatted.length - 1))
    }

    private isCelsius(formatted: string) {
        return this.isFormattedValue(formatted) && formatted.toUpperCase().trim().endsWith('C')
    }
    private isFahrenheit(formatted: string) {
        return this.isFormattedValue(formatted) && formatted.toUpperCase().trim().endsWith('F')
    }

    public parseRawTemp(formatted: string) {
        const unit = this.isFahrenheit(formatted) ? TemperatureUnit.Fahrenheit : TemperatureUnit.Celsius
        const value = this.getTempValueOnly(formatted)
        if (unit === TemperatureUnit.Fahrenheit) {
            if (value < 32 || value > 212) {
                throw new Error('Temperature out of range')
            }
            return (value - 32) * 5/9
        }
        if (!this.isCelsius(formatted)) {
            throw new Error('Invalid temperature')
        }
        if (value < 0 || value > 100) {
            throw new Error('Temperature out of range')
        }
        return value
    }
}
