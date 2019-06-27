import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { DataService } from '../../data.service';
import { SensorData } from '../../types/sensor-data.interface';

@Component({
  selector: 'app-sensor-value',
  templateUrl: './sensor-value.component.html',
  styleUrls: ['./sensor-value.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorValueComponent {

  @Input()
  set sensorKey(value: string) {
    this.sensorData$ = this.dataService.getSensorValue(value);
  }

  sensorData$: Observable<SensorData>;

  constructor(
    private dataService: DataService
  ) { }

}
