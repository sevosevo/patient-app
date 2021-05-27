import {NgModule} from '@angular/core';
import {MaterialModule} from '../material';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {TextInputComponent, DatePickerComponent, TypeAheadInputComponent} from './controls';
import {CardComponent, TableComponent} from './components';
import {AddPatientComponent} from './forms';

const declarations = [
  CardComponent,
  TextInputComponent,
  TableComponent,
  AddPatientComponent,
  DatePickerComponent,
  TypeAheadInputComponent,
];

@NgModule({
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  declarations: [...declarations],
  exports: [MaterialModule, ...declarations],
})
export class DesignSystemModule {}
