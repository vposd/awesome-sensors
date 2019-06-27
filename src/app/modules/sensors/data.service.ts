import { Injectable } from '@angular/core';
import { interval, of, Subject, BehaviorSubject, Observable } from 'rxjs';
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
   * Returns observable with sensors data list which was converted from a sensors state map
   */
  get sensorsList$() {
    return this._sensorsBroadcast
      .asObservable()
      .pipe(
        map(sensorsObject =>
          Object.keys(sensorsObject)
            .map(key => sensorsObject[key])
            .reduce((list, item) =>
              (list.push(item), list),
              []
            )
        )
      );
  }

  private _sensorsState: SensorsState = {};
  private _updatingStrategy = UpdatingStrategy.Manual;
  private readonly _manualUpdateBroadcast = new Subject();
  private readonly _sensorsBroadcast = new BehaviorSubject<SensorsState>({});

  /**
   * Stub method for initialize sensors and start listen their updates
   * Fills sensor state, starts listening sersors and notifies state broadcast
   */
  initializeSensors() {
    Array(SENSORS_COUNT)
      .fill(null)
      .forEach(() => {
        const sensor = new Sensor;

        this.listenSensorUpdates(sensor);
        this._sensorsState[sensor.key] = sensor.state;
      });

    this._sensorsBroadcast.next(this._sensorsState);
  }

  /**
   * Returns observable with sensor updates according to updating strategy
   */
  getSensorValue(key: string) {
    const valueByUpdatingStrategy$ = (value: SensorData) =>
      this._updatingStrategy === UpdatingStrategy.Live
        ? of(value)
        : this._manualUpdateBroadcast
          .pipe(
            map(() => value)
          );

    return interval(SECOND)
      .pipe(
        map(() => this.getSensorByKey(key)),
        switchMap(valueByUpdatingStrategy$),
        startWith(this.getSensorByKey(key))
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
