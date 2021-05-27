import {NgModule} from '@angular/core';
import {MaterialModule} from '../material';
import {CardComponent, TableComponent} from './components';
import {TextInputComponent} from './controls';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {AddPatientComponent} from './forms';

const declarations = [
  CardComponent,
  TextInputComponent,
  TableComponent,
  AddPatientComponent,
];

@NgModule({
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  declarations: [...declarations],
  exports: [MaterialModule, ...declarations],
})
export class DesignSystemModule {}
