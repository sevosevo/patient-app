import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import axios from 'axios';

import {
  AddPatientComponent as AddPatientFormComponent,
  FacadePatientService,
  getFullName,
  patientFactory,
  TypeAheadInputOption
} from '../../../shared';
import {Doctor, Patient} from '../../../shared/models';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'patient-app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit, OnDestroy {

  @ViewChild(AddPatientFormComponent, { static: true }) addPatientFormComponent: AddPatientFormComponent;

  subscription: Subscription[] = [];

  readonly ADD_PATIENT_FORM_TITLE = 'Add patient';

  doctors$ = this.facadePatientService.doctors$;

  doctorOptions: TypeAheadInputOption[] = [];

  constructor(
    private readonly facadePatientService: FacadePatientService,
    private readonly router: Router,
  ) { }

  ngOnInit() {
    this.subscription.push(this.facadePatientService.doctors$.subscribe(this.populateDoctorOptions.bind(this)));
  }

  populateDoctorOptions(doctors: Doctor[]) {
    this.doctorOptions = [];
    doctors.forEach(doctor => {
      this.doctorOptions.push(this.createDoctorOption(doctor));
    });
  }

  createDoctorOption(doctor: Doctor): { id: number, name: string } {
    return {
      id: doctor.id,
      name: getFullName(doctor.firstName, doctor.lastName),
    };
  }

  createNewPatient(): Patient {
    const formData = this.addPatientFormComponent.patientFormGroup.value;
    let chosenDoctor: Doctor = null;
    let newPatient: Patient = null;
    this.doctors$.subscribe(doctors => {
      chosenDoctor = doctors.find(doctor => getFullName(doctor.firstName, doctor.lastName) === formData.doctor);
    });
    this.facadePatientService.lastPatientId$.subscribe(lastId => {
      newPatient = patientFactory(
        formData,
        chosenDoctor.id,
        lastId,
      );
    });
    return newPatient;
  }

  addPatient() {
    const patient = this.createNewPatient();
    this.facadePatientService.addPatient(patient);
    this.router.navigate(['/home']).then();
  }

  ngOnDestroy() {
    this.subscription.forEach(subscription => subscription.unsubscribe());
  }

}
