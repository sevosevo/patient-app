import {Injectable} from '@angular/core';
import {ApiPatientService} from '../api';
import {StatePatientService} from '../state';

@Injectable({
  providedIn: 'root'
})
export class FacadePatientService {

  constructor(
    private readonly apiPatientService: ApiPatientService,
    private readonly statePatientService: StatePatientService,
  ) {}

  doctors$ = this.statePatientService.doctors$;
  patients$ = this.statePatientService.patients$;

  getDoctors(): void {
    this.apiPatientService.getDoctors()
      .subscribe(doctors => this.statePatientService.setDoctors(doctors));
  }

  getPatients(): void {
    this.apiPatientService.getPatients()
      .subscribe(patients => this.statePatientService.setPatients(patients));
  }

}
