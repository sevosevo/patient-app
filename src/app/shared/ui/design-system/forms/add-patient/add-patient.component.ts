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

  patientFormGroup = new FormGroup({
    [this.firstNameControlName]: new FormControl('', Validators.required),
    [this.lastNameControlName]: new FormControl('', Validators.required),
    [this.birthDateControlName]: new FormControl(null, Validators.required),
    [this.emailControlName]: new FormControl('', [Validators.required, EmailValidator.isValidMailFormat]),
    [this.VATCodeControlName]: new FormControl('', Validators.required),
    [this.doctorControlName]: new FormControl('', [Validators.required, this.doctorExists.bind(this)]),
    [this.addressesControlName]: new FormArray([
      this.createAddressFormGroup(true),
    ]),
  });

  // I left this getter in order to be able to cast this control to FormArray (so template doesn't throw an error)
  get addressControl(): FormArray {
    return this.patientFormGroup.get(this.addressesControlName) as FormArray;
  }

  createAddressFormGroup(firstAddressGroup: boolean) {
    return new FormGroup({
      [this.typeControlName]: new FormControl(firstAddressGroup ? AddressType.HOME : null, Validators.required),
      [this.phoneControlName]: new FormControl('', [Validators.required, Validators.pattern(/^\+?[0-9\s]+$/)]),
      [this.streetControlName]: new FormControl('', Validators.required),
      [this.cityControlName]: new FormControl('', Validators.required),
      [this.zipControlName]: new FormControl('', Validators.required),
      [this.countryControlName]: new FormControl('', Validators.required),
      [this.nameControlName]: new FormControl({value: '', disabled: true}, Validators.required),
    });
  }

  doctorExists(control: AbstractControl): ValidationErrors | null {
      const doctorExists = !!this.doctorOptions.find(doctor => doctor.name === control.value);
      if (!doctorExists && control.value.length > 0) {
        return {
          'doctor-not-exist': true,
        };
      }
      return null;
  }

  addAddressForm() {
    (this.patientFormGroup.get(this.addressesControlName) as FormArray).push(this.createAddressFormGroup(false));
    this.toggleNameControlBasedOnAddressType();
    this.patientFormGroup.updateValueAndValidity();
  }

  constructor() { }

  ngOnInit() {
    this.toggleVatControlBasedOnAge();
    this.toggleNameControlBasedOnAddressType();

    if (this.prefillForm) {
      this.prefill();
    }
  }

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

  prefill() {
    this.patientFormGroup.get(this.firstNameControlName).setValue(this.prefillForm[this.firstNameControlName]);
    this.patientFormGroup.get(this.lastNameControlName).setValue(this.prefillForm[this.lastNameControlName]);
    this.patientFormGroup.get(this.emailControlName).setValue(this.prefillForm[this.emailControlName]);
    this.patientFormGroup.get(this.birthDateControlName).setValue(this.prefillForm[this.birthDateControlName]);
    this.patientFormGroup.get(this.VATCodeControlName).setValue(this.prefillForm[this.VATCodeControlName]);
    this.patientFormGroup.get(this.doctorControlName).setValue(this.prefillForm.doctor);
    // Prefill home address
    this.prefillAddress(
      (this.patientFormGroup.get(this.addressesControlName) as FormArray).controls[0] as FormGroup,
      this.prefillForm.addresses.find(address => address.type === AddressType.HOME)
    );

    if (this.prefillForm.addresses.length > 1) {
      this.createPrefillAddressForms();
    }
  }

  createPrefillAddressForms() {
    this.prefillForm.addresses.slice(1).forEach((address, idx) => {
      (this.patientFormGroup.get(this.addressesControlName) as FormArray).push(this.createAddressFormGroup(false));
      // Prefill form in next cycle
      setTimeout(() => {
        this.prefillAddress((this.patientFormGroup.get(this.addressesControlName) as FormArray).controls[idx + 1] as FormGroup, address);
      });
    });
  }

  prefillAddress(addressFormGroup: FormGroup, addressData: Address) {
    addressFormGroup.get(this.phoneControlName).setValue(addressData[this.phoneControlName]);
    addressFormGroup.get(this.zipControlName).setValue(addressData[this.zipControlName]);
    addressFormGroup.get(this.streetControlName).setValue(addressData[this.streetControlName]);
    addressFormGroup.get(this.cityControlName).setValue(addressData[this.cityControlName]);
    addressFormGroup.get(this.countryControlName).setValue(addressData[this.countryControlName]);
    if (addressData[this.typeControlName]) {
      addressFormGroup.get(this.typeControlName).setValue(addressData[this.typeControlName]);
    }
    if (addressData[this.nameControlName]) {
      addressFormGroup.get(this.nameControlName).setValue(addressData[this.nameControlName]);
    }
  }

}
