import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {EmailValidator} from '../../../../validators';
import {Address, AddressType, Patient} from '../../../../models';
import {GetTimeUtility} from '../../../../utilities';
import {TypeAheadInputOption} from '../../controls';
import {Subscription} from 'rxjs';

@Component({
  selector: 'patient-app-add-patient-form',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

  @Input() prefillForm: Partial<Patient>;
  @Input() doctorOptions: TypeAheadInputOption[] = [];

  addressTypeChangeSubscription: Subscription;

  addressTypes = Object.values(AddressType).filter(type => type !== AddressType.HOME);

  readonly FIRST_NAME_LABEL = 'First Name';
  readonly LAST_NAME_LABEL = 'Last Name';
  readonly BIRTHDAY_LABEL = 'Birthday';
  readonly VAT_CODE_LABEL = 'VATCode';
  readonly EMAIL_LABEL = 'Email';
  readonly DOCTOR_LABEL = 'Doctor';
  readonly PHONE_LABEL = 'Phone number';
  readonly ZIP_LABEL = 'Zip';
  readonly COUNTRY_LABEL = 'Country';
  readonly CITY_LABEL = 'City';
  readonly STREET_LABEL = 'Street';
  readonly NAME_LABEL = 'Name';

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
  readonly phoneErrorMessageMap: Record<string, string> = {
    required: 'Phone is required',
    pattern: 'Phone is invalid',
  };
  readonly countryErrorMessageMap: Record<string, string> = {
    required: 'Country is required',
  };
  readonly streetErrorMessageMap: Record<string, string> = {
    required: 'Street is required',
  };
  readonly zipcodeErrorMessageMap: Record<string, string> = {
    required: 'Zipcode is required',
  };
  readonly cityErrorMessageMap: Record<string, string> = {
    required: 'City is required',
  };
  readonly nameErrorMessageMap: Record<string, string> = {
    required: 'Name is required',
  };

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

  createAddressFormGroup(firstAddressGroup: boolean) {
    return new FormGroup({
      [this.typeControlName]: new FormControl(firstAddressGroup ? AddressType.HOME : null, Validators.required),
      [this.phoneControlName]: new FormControl('+39', [Validators.required, Validators.pattern(/^\+?[0-9\s]+$/)]),
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
    this.addressesControl.push(this.createAddressFormGroup(false));
    this.toggleNameControlBasedOnAddressType();
    this.patientFormGroup.updateValueAndValidity();
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

  get addressesControl(): FormArray {
    return this.patientFormGroup.get(this.addressesControlName) as FormArray;
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
    this.addressesControl.controls.forEach(control => {
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
    this.birthDateControl.valueChanges.subscribe(date => {
      if (!(date instanceof Date)) {
        return;
      }
      if (GetTimeUtility.calculateAge(date) > 18) {
        this.VATControl.setValidators(Validators.required);
      } else {
        this.VATControl.clearValidators();
      }
      this.VATControl.updateValueAndValidity();
    });
  }

  removeAddressForm(index: number) {
    this.addressesControl.removeAt(index);
    this.patientFormGroup.updateValueAndValidity();
  }

  prefill() {
    this.firstNameControl.setValue(this.prefillForm.firstName);
    this.lastNameControl.setValue(this.prefillForm.lastName);
    this.emailControl.setValue(this.prefillForm.email);
    this.birthDateControl.setValue(this.prefillForm.birthDate);
    this.VATControl.setValue(this.prefillForm.VATCode);
    this.doctorControl.setValue(this.prefillForm.doctor);
    // Prefill home address
    this.prefillAddress(this.addressesControl.controls[0] as FormGroup, this.prefillForm.addresses.find(address => address.type === AddressType.HOME));

    if (this.prefillForm.addresses.length > 1) {
      this.createPrefillAddressForms();
    }
  }

  createPrefillAddressForms() {
    this.prefillForm.addresses.slice(1).forEach((address, idx) => {
      this.addressesControl.push(this.createAddressFormGroup(false));
      // Prefill form in next cycle
      setTimeout(() => {
        this.prefillAddress(this.addressesControl.controls[idx + 1] as FormGroup, address);
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
