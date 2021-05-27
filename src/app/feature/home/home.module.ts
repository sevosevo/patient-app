import {NgModule} from '@angular/core';
import {HomeComponent} from './home.component';
import {UiModule} from '../../shared';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [UiModule, CommonModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
})
export class HomeModule {}
