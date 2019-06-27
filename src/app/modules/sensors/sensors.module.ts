import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { DashboardComponent } from './dashboard/dashboard.component';
import { SensorDetailsComponent } from './sensor-details/sensor-details.component';
import { SensorsRoutingModule } from './sensors-routing.module';
import { SensorValueComponent } from './dashboard/sensor-value/sensor-value.component';
import { SensorsComponent } from './sensors.component';

@NgModule({
  declarations: [
    DashboardComponent,
    SensorDetailsComponent,
    SensorValueComponent,
    SensorsComponent
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    SensorsRoutingModule
  ]
})
export class SensorsModule { }
