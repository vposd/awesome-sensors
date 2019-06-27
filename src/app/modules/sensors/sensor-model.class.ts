import { interval } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { HOUR } from './constants';
import { SensorData } from './types/sensor-data.interface';

const generateKey = (id: number, size: number) => {
  let string = String(id);
  while (string.length < (size || 2)) {
    string = '0' + string;
  }
  return string;
};

const random = (min: number, max: number) => Math.floor(Math.random() * max) + min;

/**
 * Sensor class responbles for fake value updates and providing sensor state
 */
export class Sensor implements SensorData {
  private static id = 1;

  key: string;
  time: Date;
  value: number;
  description: string;

  private readonly valuesRangeFrom = random(-10000, 10000);
  private readonly valuesRangeTo = random(10000, 1000000);
  private updateInterval: number;

  constructor() {
    this.initialize();
  }

  get state(): SensorData {
    return {
      key: this.key,
      description: this.description,
      time: this.time,
      value: this.value
    };
  }

  get connect$() {
    return interval(this.updateInterval)
      .pipe(
        tap(() => {
          this.time = new Date();
          this.value = random(this.valuesRangeFrom, this.valuesRangeTo);
        }),
        map(() => this.state)
      );
  }

  private initialize() {
    const updateIntervalFrom = 1;
    const updateIntervalTo = random(0, HOUR * random(1, 3));

    this.key = generateKey(Sensor.id++, 5);
    this.value = 0;
    this.updateInterval = random(updateIntervalFrom, updateIntervalTo);
    this.description = `Sensor ${this.key} updates each ${this.updateInterval}ms and provides values from ${this.valuesRangeFrom} to ${this.valuesRangeTo}`;
  }
}
