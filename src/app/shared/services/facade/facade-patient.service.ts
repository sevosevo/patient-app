import {Injectable} from '@angular/core';
import {ApiPatientService} from '../api';
import {StatePatientService} from '../state';
import {Patient} from '../../models';
import {first, map} from 'rxjs/operators';

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

  lastPatientId$ = this.patients$.pipe(map(patients => patients[patients.length - 1].id));

  getDoctors(): void {
    this.apiPatientService.getDoctors()
      .subscribe(doctors => this.statePatientService.setDoctors(doctors));
  }

  getPatients(): void {
    this.apiPatientService.getPatients()
      .subscribe(patients => this.statePatientService.setPatients(patients));
  }

  addPatient(patient: Patient): void {
    this.statePatientService.patients$.pipe(first()).subscribe(patients => {
      this.statePatientService.setPatients([...patients, patient]);
    });
  }

}
