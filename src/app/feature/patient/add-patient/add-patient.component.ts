import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import axios from 'axios';

import {AddPatientComponent as AddPatientFormComponent, FacadePatientService, TypeAheadInputOption} from '../../../shared';
import {Doctor, Patient} from '../../../shared/models';
import {Subscription} from 'rxjs';

@Component({
  selector: 'patient-app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit, OnDestroy {

  @ViewChild(AddPatientFormComponent, { static: true }) addPatientFormComponent: AddPatientFormComponent;

  subscription: Subscription;

  readonly ADD_PATIENT_FORM_TITLE = 'Add patient';

  doctorOptions: TypeAheadInputOption[] = [];

  constructor(
    private readonly facadePatientService: FacadePatientService,
  ) { }

  ngOnInit() {
    this.facadePatientService.doctors$.subscribe(this.populateDoctorOptions.bind(this));
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
      name: doctor.firstName + ' ' + doctor.lastName,
    };
  }

  createNewPatient(): Patient {
    const formData = this.addPatientFormComponent.patientFormGroup.value;
    return {
      // @todo: map appropriate fields
      ...formData
    };
  }

  addPatient() {
    const patient = this.createNewPatient();
    // axios.post('...')
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
