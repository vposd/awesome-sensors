import { SensorData } from './sensor-data.interface';

export interface SensorsState {
  [key: string]: SensorData;
}
