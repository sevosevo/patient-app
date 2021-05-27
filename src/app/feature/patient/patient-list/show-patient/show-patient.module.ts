import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UiModule} from '../../../../shared';
import {ShowPatientComponent} from './show-patient.component';

@NgModule({
  imports: [UiModule, CommonModule],
  declarations: [ShowPatientComponent],
  exports: [ShowPatientComponent],
  entryComponents: [ShowPatientComponent],
})
export class ShowPatientModule {}
