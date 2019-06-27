import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'sensors',
    loadChildren: () => import('src/app/modules/sensors/sensors.module').then(m => m.SensorsModule)
  },
  {
    path: '**',
    redirectTo: 'sensors',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
