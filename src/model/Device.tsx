import { observable, computed } from 'mobx'
import _ from 'lodash'
import appStore, { TemperatureUnit } from '../store/AppStore'

export default class Device {
    public _id: string = ""
    public id: string = ""
    @observable name: string = ""
    @observable currentTemperature: number = -1
    @observable targetTemperature?: number = -1
    @observable currentState: string = ""
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

    @computed get currentTemperatureDisplay() {
        return this.formatTemp(appStore.temperatureUnit, this.currentTemperature, 2)
    }

    @computed get targetTemperatureDisplay() {
        return this.formatTemp(appStore.temperatureUnit, this.targetTemperature)
    }

    private formatTemp(unit: TemperatureUnit, temperature?: number, decimalPlaces?: number) {
        if (temperature === undefined) {
            return '-'
        }

        let value = temperature
        if (unit === TemperatureUnit.Fahrenheit) {
            value = (value * 9/5) + 32
        }
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
