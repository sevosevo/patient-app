import {NgModule} from '@angular/core';
import {MaterialModule} from '../material';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {TextInputComponent, DatePickerComponent} from './controls';
import {CardComponent, TableComponent} from './components';
import {AddPatientComponent} from './forms';

const declarations = [
  CardComponent,
  TextInputComponent,
  TableComponent,
  AddPatientComponent,
];

@NgModule({
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  declarations: [...declarations, DatePickerComponent],
  exports: [MaterialModule, ...declarations],
})
export class DesignSystemModule {}
