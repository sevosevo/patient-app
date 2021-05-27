import {Component, OnInit} from '@angular/core';
import {BaseLayoutMenuItem, BaseLayoutService} from './layout';
import {FacadePatientService} from './shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private readonly facadePatientService: FacadePatientService,
    private readonly baseLayoutService: BaseLayoutService,
  ) {}

  readonly baseLayoutConfig = {
    TOOLBAR_TITLE: 'Patient App',
  };

  readonly MENU_ITEMS: BaseLayoutMenuItem[] = [
    {
      label: 'Home',
      path: '/home',
      icon: 'home',
    },
    {
      label: 'List patients',
      path: '/patients',
      icon: 'find_in_page',
    },
    {
      label: 'Add new patient',
      path: '/patients/add-patient',
      icon: 'account_circle',
    },
  ];


  ngOnInit() {
    this.initializeLayout();

    this.facadePatientService.getPatients();
    this.facadePatientService.getDoctors();

    this.facadePatientService.patients$.subscribe(patients => console.log('Got patients ', patients));
    this.facadePatientService.doctors$.subscribe(doctors => console.log('Got doctors', doctors));
  }

  initializeLayout() {
    this.baseLayoutService.toolbarTitleSubject.next(this.baseLayoutConfig.TOOLBAR_TITLE);
    this.baseLayoutService.menuItemsSubject.next(this.MENU_ITEMS);
  }

}
