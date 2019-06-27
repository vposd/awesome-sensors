import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SensorDetailsComponent } from './sensor-details/sensor-details.component';
import { SensorsComponent } from './sensors.component';

const routes: Routes = [
  {
    path: '',
    component: SensorsComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: ':key',
        component: SensorDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class SensorsRoutingModule { }
