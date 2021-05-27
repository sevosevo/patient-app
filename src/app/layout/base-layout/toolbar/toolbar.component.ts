import {Component, OnInit} from '@angular/core';
import {BaseLayoutService} from '../base-layout.service';

@Component({
  selector: 'patient-app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(public readonly baseLayoutService: BaseLayoutService) {}

  ngOnInit() {}

}
