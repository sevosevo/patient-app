import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {EmailValidator} from '../../../../validators';
import {Patient} from '../../../../models';

@Component({
  selector: 'patient-app-add-patient-form',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

  @Input() prefillForm: Partial<Patient>;

  readonly FIRST_NAME_LABEL = 'First Name';
  readonly LAST_NAME_LABEL = 'Last Name';
  readonly VAT_CODE_LABEL = 'VATCode';
  readonly EMAIL_LABEL = 'Email';

  readonly firstNameControlName = 'firstName';
  readonly lastNameControlName = 'lastName';
  readonly birthDateControlName = 'birthDate';
  readonly emailControlName = 'email';
  readonly VATCodeControlName = 'VATCode';

  readonly firstNameErrorMessageMap: Record<string, string> = {
    required: 'First name is required',
  };
  readonly lastNameErrorMessageMap: Record<string, string> = {
    required: 'Last name is required',
  };
  readonly emailErrorMessageMap: Record<string, string> = {
    required: 'Email is required',
    'email-not-valid': 'Email is not right format',
  };

  patientFormGroup = new FormGroup({
    [this.firstNameControlName]: new FormControl('', Validators.required),
    [this.lastNameControlName]: new FormControl('', Validators.required),
    [this.birthDateControlName]: new FormControl(null, Validators.required),
    [this.emailControlName]: new FormControl('', [Validators.required, EmailValidator.isValidMailFormat]),
    [this.VATCodeControlName]: new FormControl('', Validators.required),
  });

  get firstNameControl(): FormControl {
    return this.patientFormGroup.get(this.firstNameControlName) as FormControl;
  }

  get lastNameControl(): FormControl {
    return this.patientFormGroup.get(this.lastNameControlName) as FormControl;
  }

  get birthDateControl(): FormControl {
    return this.patientFormGroup.get(this.birthDateControlName) as FormControl;
  }

  get emailControl(): FormControl {
    return this.patientFormGroup.get(this.emailControlName) as FormControl;
  }

  constructor() { }

  ngOnInit() {
    if (this.prefillForm) {
      this.prefill();
    }
  }

  prefill() {
    this.firstNameControl.setValue(this.prefillForm.firstName);
    this.lastNameControl.setValue(this.prefillForm.lastName);

  }

}
