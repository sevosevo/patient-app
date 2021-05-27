import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {EmailValidator} from '../../../../validators';
import {Patient} from '../../../../models';
import {GetTimeUtility} from '../../../../utilities';
import {TypeAheadInputOption} from '../../controls';

@Component({
  selector: 'patient-app-add-patient-form',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

  @Input() prefillForm: Partial<Patient>;
  @Input() doctorOptions: TypeAheadInputOption[] = [];

  readonly FIRST_NAME_LABEL = 'First Name';
  readonly LAST_NAME_LABEL = 'Last Name';
  readonly BIRTHDAY_LABEL = 'Birthday';
  readonly VAT_CODE_LABEL = 'VATCode';
  readonly EMAIL_LABEL = 'Email';
  readonly DOCTOR_LABEL = 'Doctor';

  readonly firstNameControlName = 'firstName';
  readonly lastNameControlName = 'lastName';
  readonly birthDateControlName = 'birthDate';
  readonly emailControlName = 'email';
  readonly VATCodeControlName = 'VATCode';
  readonly doctorControlName = 'doctor';

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
  readonly birthdayErrorMessageMap: Record<string, string> = {
    required: 'Birthday is required',
  };
  readonly vatErrorMessageMap: Record<string, string> = {
    required: 'VAT Code is required',
  };
  readonly doctorErrorMessageMap: Record<string, string> = {
    required: 'Please choose a doctor',
    'doctor-not-exist': 'Doctor with given name does not exist',
  };

  patientFormGroup = new FormGroup({
    [this.firstNameControlName]: new FormControl('', Validators.required),
    [this.lastNameControlName]: new FormControl('', Validators.required),
    [this.birthDateControlName]: new FormControl(null, Validators.required),
    [this.emailControlName]: new FormControl('', [Validators.required, EmailValidator.isValidMailFormat]),
    [this.VATCodeControlName]: new FormControl('', Validators.required),
    [this.doctorControlName]: new FormControl('', [Validators.required, this.doctorExists.bind(this)]),
  });

  doctorExists(control: AbstractControl): ValidationErrors | null {
      const doctorExists = !!this.doctorOptions.find(doctor => doctor.name === control.value);
      if (!doctorExists && control.value.length > 0) {
        return {
          'doctor-not-exist': true,
        };
      }
      return null;
  }

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

  get VATControl(): FormControl {
    return this.patientFormGroup.get(this.VATCodeControlName) as FormControl;
  }

  get doctorControl(): FormControl {
    return this.patientFormGroup.get(this.doctorControlName) as FormControl;
  }

  constructor() { }

  ngOnInit() {
    this.toggleVatControlBasedOnAge();

    if (this.prefillForm) {
      this.prefill();
    }
  }

  toggleVatControlBasedOnAge() {
    this.birthDateControl.valueChanges.subscribe(date => {
      if (GetTimeUtility.calculateAge(date) > 18) {
        this.VATControl.setValidators(Validators.required);
      } else {
        this.VATControl.clearValidators();
      }
      this.VATControl.updateValueAndValidity();
    });
  }


  prefill() {
    this.firstNameControl.setValue(this.prefillForm.firstName);
    this.lastNameControl.setValue(this.prefillForm.lastName);
    this.emailControl.setValue(this.prefillForm.email);
    this.birthDateControl.setValue(this.prefillForm.birthDate);
    this.VATControl.setValue(this.prefillForm.VATCode);
  }

}
