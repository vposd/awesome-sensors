import { Injectable } from '@angular/core';
import { interval, of, Subject } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';

import { SENSORS_COUNT, SECOND } from './constants';
import { Sensor } from './sensor-model.class';
import { SensorData } from './types/sensor-data.interface';
import { SensorsState } from './types/sensors-state.interface';
import { UpdatingStrategy } from './types/updating-strategy.enum';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  set updatingStrategy(value: UpdatingStrategy) {
    this._updatingStrategy = value;
  }

  get updatingStrategy() {
    return this._updatingStrategy;
  }

  /**
   * Return observable which broadcast interval updates of sensorss state
   * According to update strategy
   */
  get updates$() {
    const valueByUpdatingStrategy$ = (value: SensorsState) =>
      this._updatingStrategy === UpdatingStrategy.Live
        ? of(value)
        : this._manualUpdateBroadcast
          .pipe(
            map(() => value)
          );

    return interval(SECOND)
      .pipe(
        map(() => this._sensorsState),
        switchMap(valueByUpdatingStrategy$),
        startWith(this._sensorsState)
      );
  }

  private _sensorsState: SensorsState = {};
  private _updatingStrategy = UpdatingStrategy.Manual;
  private readonly _manualUpdateBroadcast = new Subject();

  /**
   * Method for initialize fake sensors and start listen their updates
   * Fills sensor state, starts listening sersors
   */
  initializeSensors() {
    Array(SENSORS_COUNT)
      .fill(null)
      .forEach(() => {
        const sensor = new Sensor;

        this.listenSensorUpdates(sensor);
        this._sensorsState[sensor.key] = sensor.state;
      });
  }

  /**
   * Returns observable with sensor updates according to updating strategy
   */
  getSensorData(key: string) {
    return this.updates$
      .pipe(
        map(() => this.getSensorByKey(key))
      );
  }

  /**
   * Emits event for manual updating sensors state
   */
  updateSensorsValues() {
    this._manualUpdateBroadcast.next();
  }

  private getSensorByKey(key: string): SensorData {
    return this._sensorsState[key]
      ? { ...this._sensorsState[key] }
      : null;
  }

  private listenSensorUpdates(sensor: Sensor) {
    sensor
      .connect$
      .subscribe(updatedState =>
        this._sensorsState[sensor.key] = updatedState
      );
  }
}
