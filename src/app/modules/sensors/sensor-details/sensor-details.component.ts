import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { pluck, switchMap, tap } from 'rxjs/operators';

import { DataService } from '../data.service';
import { SensorData } from '../types/sensor-data.interface';

@Component({
  selector: 'app-sensor-details',
  templateUrl: './sensor-details.component.html',
  styleUrls: ['./sensor-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorDetailsComponent implements OnInit {

  sensor$: Observable<SensorData>;
  sensorKey$: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.sensorKey$ = this.route
      .params
      .pipe(
        pluck('key')
      );

    this.sensor$ = this.sensorKey$
      .pipe(
        switchMap(key =>
          this.dataService.getSensorData(key)
        )
      );
  }

}
