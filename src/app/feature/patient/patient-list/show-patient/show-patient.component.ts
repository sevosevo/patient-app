import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {map} from 'rxjs/operators';

import {AddPatientComponent, FacadePatientService} from '../../../../shared';
import {Observable, of} from 'rxjs';
import {Patient} from '../../../../shared/models';

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public patientId: number,
    private dialogRef: MatDialogRef<ShowPatientComponent>,
    private facadePatientService: FacadePatientService,
  ) { }

  ngOnInit() {
    this.patient$ = this.facadePatientService.patients$
      .pipe(map(patients => patients.find(patient => patient.id === this.patientId)));

    this.disableAllFormFields();
  }

  disableAllFormFields() {
    this.AddPatientFormComponent.patientFormGroup.disable();
  }

  handleBackButtonClick() {
    this.dialogRef.close();
  }

}
