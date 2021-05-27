import {NgModule} from '@angular/core';
import {AddPatientComponent} from './add-patient.component';
import {UiModule} from '../../../shared';

@NgModule({
  imports: [UiModule],
  declarations: [AddPatientComponent],
  exports: [AddPatientComponent],
})
export class AddPatientModule {}
