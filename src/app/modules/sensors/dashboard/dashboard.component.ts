import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, HostListener, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { DASHBOARD_SENSOR_ITEM_WIDTH, DASHBOARD_SENSOR_ITEM_HEIGHT, DASHBOARD_COLS_DEFAULT, DASHBOARD_ROWS_DEFAULT } from '../constants';
import { DataService } from '../data.service';
import { SensorData } from '../types/sensor-data.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {

  readonly itemHeight = DASHBOARD_SENSOR_ITEM_HEIGHT;
  readonly itemWidth = DASHBOARD_SENSOR_ITEM_WIDTH;
  cols = DASHBOARD_COLS_DEFAULT;
  rows = DASHBOARD_ROWS_DEFAULT;
  sensors$: Observable<SensorData[]>;

  @ViewChild('cdkViewport', { static: true }) cdkViewPort: CdkVirtualScrollViewport;

  @HostListener('window:resize') onResize() {
    this.updateViewportOptions();
  }

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.updateViewportOptions();
    this.sensors$ = this.dataService.sensorsList$;
  }

  trackByKey(_: number, item: SensorData) {
    return item.key;
  }

  private updateViewportOptions() {
    const { clientWidth, clientHeight } = this.cdkViewPort.elementRef.nativeElement;

    this.cols = Math.ceil(clientWidth / this.itemWidth);
    this.rows = Math.ceil(clientHeight / this.itemHeight);
  }

}
