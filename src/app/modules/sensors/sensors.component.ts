import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { DataService } from './data.service';
import { UpdatingStrategy } from './types/updating-strategy.enum';

@Component({
  selector: 'app-sensors',
  templateUrl: './sensors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorsComponent implements OnInit {

  liveUpdateEnabled = false;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.updatingStrategyOptions();
    this.dataService.initializeSensors();
  }

  manualUpdate() {
    this.dataService.updateSensorsValues();
  }

  startLiveUpdate() {
    this.dataService.updatingStrategy = UpdatingStrategy.Live;
    this.updatingStrategyOptions();
  }

  stopLiveUpdate() {
    this.dataService.updatingStrategy = UpdatingStrategy.Manual;
    this.updatingStrategyOptions();
  }

  private updatingStrategyOptions() {
    this.liveUpdateEnabled = this.dataService.updatingStrategy === UpdatingStrategy.Live;
  }

}
