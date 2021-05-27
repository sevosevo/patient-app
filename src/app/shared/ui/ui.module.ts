import {NgModule} from '@angular/core';
import {DesignSystemModule} from './design-system';

@NgModule({
  imports: [DesignSystemModule],
  exports: [DesignSystemModule],
})
export class UiModule {}
