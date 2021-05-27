import {Component, OnInit, ViewChild} from '@angular/core';
import axios from 'axios';

import {AddPatientComponent as AddPatientFormComponent} from '../../../shared';
import {Patient} from '../../../shared/models';

@Component({
  selector: 'patient-app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

  @ViewChild(AddPatientFormComponent, { static: true }) addPatientFormComponent: AddPatientFormComponent;

  readonly ADD_PATIENT_FORM_TITLE = 'Add patient';

  constructor() { }

  ngOnInit() {}

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

}
