import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'patient-app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

  ADD_PATIENT_FORM_TITLE = 'Add patient';

  patientFormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    birthDate: new FormControl(null, Validators.required),
    email: new FormControl('', Validators.required),
  });

  constructor() { }

  ngOnInit() {
  }

}
