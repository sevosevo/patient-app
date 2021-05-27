import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Patient, Doctor} from '../../models';


@Injectable({
  providedIn: 'root'
})
export class StatePatientService {

  private readonly patientsSubject = new BehaviorSubject<Patient[]>([]);
  private readonly doctorsSubject = new BehaviorSubject<Doctor[]>([]);

  readonly patients$ = this.patientsSubject.asObservable();
  readonly doctors$ = this.doctorsSubject.asObservable();

  setPatients(patients: Patient[]) {
    this.patientsSubject.next(patients);
  }

  setDoctors(doctors: Doctor[]) {
    this.doctorsSubject.next(doctors);
  }

}
