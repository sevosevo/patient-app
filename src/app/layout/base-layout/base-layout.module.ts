import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {UiModule} from '../../shared';
import {BaseLayoutComponent} from './base-layout.component';
import {ToolbarComponent} from './toolbar';

@NgModule({
  imports: [UiModule, CommonModule, RouterModule],
  declarations: [BaseLayoutComponent, ToolbarComponent],
  exports: [BaseLayoutComponent],
})
export class BaseLayoutModule {}
