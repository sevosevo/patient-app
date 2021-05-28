import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {EmailValidator} from '../../../../validators';
import {Address, AddressType, Patient} from '../../../../models';
import {GetTimeUtility} from '../../../../utilities';
import {TypeAheadInputOption} from '../../controls';
import {Subscription} from 'rxjs';

enum AddPatientInputLabels {
  FIRST_NAME_LABEL = 'First Name',
  LAST_NAME_LABEL = 'Last Name',
  BIRTHDAY_LABEL = 'Birthday',
  VAT_CODE_LABEL = 'VATCode',
  EMAIL_LABEL = 'Email',
  DOCTOR_LABEL = 'Doctor',
  PHONE_LABEL = 'Phone number',
  ZIP_LABEL = 'Zip',
  COUNTRY_LABEL = 'Country',
  CITY_LABEL = 'City',
  STREET_LABEL = 'Street',
  NAME_LABEL = 'Name',
}

@Component({
  selector: 'patient-app-add-patient-form',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

  @Input() prefillForm: Partial<Patient>;
  @Input() doctorOptions: TypeAheadInputOption[] = [];

  addressTypeChangeSubscription: Subscription;

  AddPatientInputLabels = AddPatientInputLabels;

  addressTypes = Object.values(AddressType).filter(type => type !== AddressType.HOME);

  readonly firstNameControlName = 'firstName';
  readonly lastNameControlName = 'lastName';
  readonly birthDateControlName = 'birthDate';
  readonly emailControlName = 'email';
  readonly VATCodeControlName = 'VATCode';
  readonly doctorControlName = 'doctor';
  readonly addressesControlName = 'addresses';
  readonly phoneControlName = 'phone';
  readonly streetControlName = 'street';
  readonly cityControlName = 'city';
  readonly zipControlName = 'zipcode';
  readonly countryControlName = 'country';
  readonly typeControlName = 'type';
  readonly nameControlName = 'name';

  patientFormGroup: FormGroup;

  ngOnInit() {
    this.createPatientFormGroup(this.prefillForm);

    this.toggleVatControlBasedOnAge();
    this.toggleNameControlBasedOnAddressType();
  }

  createPatientFormGroup(prefillForm: Partial<Patient>) {
    this.patientFormGroup = new FormGroup({
      [this.firstNameControlName]: new FormControl(prefillForm ? prefillForm[this.firstNameControlName] : '', Validators.required),
      [this.lastNameControlName]: new FormControl(prefillForm ? prefillForm[this.lastNameControlName] : '', Validators.required),
      [this.birthDateControlName]: new FormControl(prefillForm ? prefillForm[this.birthDateControlName] : null, Validators.required),
      [this.emailControlName]: new FormControl(prefillForm ? prefillForm[this.emailControlName] : '', [Validators.required, EmailValidator.isValidMailFormat]),
      [this.VATCodeControlName]: new FormControl(prefillForm ? prefillForm[this.VATCodeControlName] : '', Validators.required),
      [this.doctorControlName]: new FormControl(prefillForm ? prefillForm[this.doctorControlName] : '', [Validators.required, this.doctorExists.bind(this)]),
      [this.addressesControlName]: new FormArray([
        this.createAddressFormGroup(true,
          prefillForm && prefillForm[this.addressesControlName] ?
            prefillForm[this.addressesControlName].find(address => address.type === AddressType.HOME) :
            null,
        ),
      ]),
    });

    if (this.prefillForm) {
      this.createAndPrefillAddresses(prefillForm);
      this.patientFormGroup.disable();
    }
  }

  // I left this getter in order to be able to cast this control to FormArray (so template doesn't throw an error)
  get addressControl(): FormArray {
    return this.patientFormGroup.get(this.addressesControlName) as FormArray;
  }

  createAddressFormGroup(firstAddressGroup: boolean, prefillData?: Partial<Address>) {
    return new FormGroup({
      [this.typeControlName]: new FormControl(firstAddressGroup ? AddressType.HOME : (prefillData[this.typeControlName] || null), Validators.required),
      [this.phoneControlName]: new FormControl(prefillData ? prefillData[this.phoneControlName] : '', [Validators.required, Validators.pattern(/^\+?[0-9\s]+$/)]),
      [this.streetControlName]: new FormControl(prefillData ? prefillData[this.streetControlName] : '', Validators.required),
      [this.cityControlName]: new FormControl(prefillData ? prefillData[this.cityControlName] : '', Validators.required),
      [this.zipControlName]: new FormControl(prefillData ? prefillData[this.zipControlName] : '', Validators.required),
      [this.countryControlName]: new FormControl(prefillData ? prefillData[this.countryControlName] : '', Validators.required),
      [this.nameControlName]: new FormControl({ value: prefillData ? prefillData[this.nameControlName] : '', disabled: true }, Validators.required),
    });
  }

  doctorExists(control: AbstractControl): ValidationErrors | null {
      const doctorExists = !!this.doctorOptions.find(doctor => doctor.name === control.value);
      if (!doctorExists && (control.value && control.value.length > 0)) {
        return {
          'doctor-not-exist': true,
        };
      }
      return null;
  }

  addAddressForm() {
    (this.patientFormGroup.get(this.addressesControlName) as FormArray).push(this.createAddressFormGroup(false, {}));
    this.toggleNameControlBasedOnAddressType();
    this.patientFormGroup.updateValueAndValidity();
  }

  constructor() { }

  toggleNameControlBasedOnAddressType() {
    if (this.addressTypeChangeSubscription && !this.addressTypeChangeSubscription.closed) {
      this.addressTypeChangeSubscription.unsubscribe();
    }
    (this.patientFormGroup.get(this.addressesControlName) as FormArray).controls.forEach(control => {
      this.addressTypeChangeSubscription = control.get(this.typeControlName).valueChanges.subscribe(type => {
        if (type === AddressType.WORK || type === AddressType.CLOSE_RELATIVE) {
          control.get(this.nameControlName).enable();
        } else {
          control.get(this.nameControlName).disable();
        }
      });
    });
  }

  toggleVatControlBasedOnAge() {
    this.patientFormGroup.get(this.birthDateControlName).valueChanges.subscribe(date => {
      if (!(date instanceof Date)) {
        return;
      }
      if (GetTimeUtility.calculateAge(date) > 18) {
        this.patientFormGroup.get(this.VATCodeControlName).setValidators(Validators.required);
      } else {
        this.patientFormGroup.get(this.VATCodeControlName).clearValidators();
      }
      this.patientFormGroup.get(this.VATCodeControlName).updateValueAndValidity();
    });
  }

  removeAddressForm(index: number) {
    (this.patientFormGroup.get(this.addressesControlName) as FormArray).removeAt(index);
    this.patientFormGroup.updateValueAndValidity();
  }

  addInternationalNumber(control: AbstractControl) {
    if (control.value.length !== 0 && control.value.startsWith('+')) {
      return;
    }
    control.setValue('+39' + control.value);
  }

  createAndPrefillAddresses(prefillForm: Partial<Patient>) {
    if (prefillForm[this.addressesControlName].length <= 1) {
      return;
    }
    this.createAndPrefillAddressForms(this.prefillForm);
  }

  createAndPrefillAddressForms(prefillForm: Partial<Patient>) {
    prefillForm[this.addressesControlName].slice(1).forEach(prefillData => {
      (this.patientFormGroup.get(this.addressesControlName) as FormArray).push(this.createAddressFormGroup(false, prefillData));
    });
  }

}
