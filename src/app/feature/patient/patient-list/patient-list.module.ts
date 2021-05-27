import {NgModule} from '@angular/core';
import {PatientListComponent} from './patient-list.component';
import {UiModule} from '../../../shared';
import {CommonModule} from '@angular/common';
import {ShowPatientModule} from './show-patient';

@NgModule({
  imports: [UiModule, ShowPatientModule, CommonModule],
  declarations: [PatientListComponent],
  exports: [PatientListComponent],
})
export class PatientListModule {}
