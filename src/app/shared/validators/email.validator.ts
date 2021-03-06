import { AbstractControl } from '@angular/forms';


export class EmailValidator {

  static isValidMailFormat(control: AbstractControl) {
    const EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    if (control.value !== '' && ((control.value && control.value.length <= 5) || !EMAIL_REGEXP.test(control.value))) {
      return { 'email-not-valid': true };
    }

    return null;
  }

}
