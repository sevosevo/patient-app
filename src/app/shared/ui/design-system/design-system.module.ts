import {NgModule} from '@angular/core';
import {MaterialModule} from '../material';
import {CardComponent, TableComponent} from './components';
import {TextInputComponent} from './controls';
import {CommonModule} from '@angular/common';

const declarations = [
  CardComponent,
  TextInputComponent,
  TableComponent,
];

@NgModule({
  imports: [MaterialModule, CommonModule],
  declarations: [...declarations],
  exports: [MaterialModule, ...declarations],
})
export class DesignSystemModule {}
