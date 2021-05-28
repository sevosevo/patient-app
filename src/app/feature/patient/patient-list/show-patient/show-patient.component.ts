import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {first, map, withLatestFrom} from 'rxjs/operators';

import {AddPatientComponent, FacadePatientService, getFullName} from '../../../../shared';
import {Observable, of} from 'rxjs';
import {Doctor, Patient} from '../../../../shared/models';

@Component({
  selector: 'patient-app-show-patient',
  templateUrl: './show-patient.component.html',
  styleUrls: ['./show-patient.component.css']
})
export class ShowPatientComponent implements OnInit {

  @ViewChild(AddPatientComponent, { static: true }) AddPatientFormComponent: AddPatientComponent;

  readonly SHOW_PATIENT_TITLE = 'Patient details';
  readonly showSaveButton = false;
  readonly showBackButton = true;

  patient$: Observable<Patient> = of(null);
  doctors$: Observable<Doctor[]> = this.facadePatientService.doctors$;

  constructor(
    @Inject(MAT_DIALOG_DATA) public patientId: number,
    private dialogRef: MatDialogRef<ShowPatientComponent>,
    private facadePatientService: FacadePatientService,
  ) { }

  ngOnInit() {
    this.patient$ = this.facadePatientService.patients$
      .pipe(
        first(),
        map(patients => patients.find(patient => patient.id === this.patientId)),
        withLatestFrom(this.doctors$),
        map(([patient, doctors]) => {
          const patientCopy = { ...patient };
          const chosenDoctor = doctors.find(doctor => doctor.id === patient.doctor);
          patientCopy.doctor = getFullName(chosenDoctor.firstName, chosenDoctor.lastName);
          return patientCopy;
        }),
      );

    this.disableAllFormFields();
  }

  disableAllFormFields() {
    setTimeout(() => {
      this.AddPatientFormComponent.patientFormGroup.disable();
    });
  }

  handleBackButtonClick() {
    this.dialogRef.close();
  }

}
