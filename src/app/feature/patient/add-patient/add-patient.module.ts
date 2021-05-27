import {NgModule} from '@angular/core';
import {AddPatientComponent} from './add-patient.component';
import {UiModule} from '../../../shared';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  imports: [UiModule, ReactiveFormsModule],
  declarations: [AddPatientComponent],
  exports: [AddPatientComponent],
})
export class AddPatientModule {}
