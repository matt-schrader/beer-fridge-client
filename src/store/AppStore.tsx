import { observable } from "mobx";

export enum TemperatureUnit {
    Fahrenheit,
    Celsius
}

export class AppStore {
    @observable temperatureUnit = TemperatureUnit.Fahrenheit
}

export default new AppStore()