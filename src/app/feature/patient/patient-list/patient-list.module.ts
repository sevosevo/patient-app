import {NgModule} from '@angular/core';
import {PatientListComponent} from './patient-list.component';
import {UiModule} from '../../../shared';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [UiModule, CommonModule],
  declarations: [PatientListComponent],
  exports: [PatientListComponent],
})
export class PatientListModule {}
