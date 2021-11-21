import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';

import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from './reporting.component';
import { LeanStartupComponent } from './components/lean-startup/lean-startup.component';


@NgModule({
  declarations: [ReportingComponent, LeanStartupComponent],
  imports: [
    CommonModule,
    ReportingRoutingModule,
    ChartsModule
  ]
})
export class ReportingModule { }
