import {Component} from '@angular/core';

import {BaseLayoutService} from './base-layout.service';


@Component({
  selector: 'patient-app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css'],
})
export class BaseLayoutComponent {

  constructor(public readonly baseLayoutService: BaseLayoutService) {}

}
