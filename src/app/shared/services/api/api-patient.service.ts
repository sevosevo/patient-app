import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Doctor, Patient} from '../../models';

// @ts-ignore
import patients from '../../../mock-database/patients.json';
// @ts-ignore
import doctors from '../../../mock-database/doctors.json';

@Injectable({
  providedIn: 'root',
})
export class ApiPatientService {

  getPatients(): Observable<Patient[]> {
    return of(patients as unknown as Patient[]);
  }

  getDoctors(): Observable<Doctor[]> {
    return of(doctors as unknown as Doctor[]);
  }

}
