import {Component, Input, OnInit} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
} from '@angular/forms';

@Component({
  selector: 'patient-app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextInputComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: TextInputComponent,
      multi: true,
    },
  ],
})
export class TextInputComponent implements ControlValueAccessor, OnInit {

  @Input() label: string;
  @Input() placeholder: string;
  @Input() validators: ValidatorFn[] = [];

  inputControl: FormControl = new FormControl(null);

  ngOnInit() {
    this.initializeValidation();
  }

  registerOnChange(fn: (change) => void): void {
    this.inputControl.valueChanges.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.inputControl.disable();
    } else {
      this.inputControl.enable();
    }
  }

  registerOnTouched(fn: () => void): void {}

  writeValue(val: unknown): void {
    this.inputControl.setValue(val);
  }

  initializeValidation() {
    this.inputControl.setValidators(this.validators);
  }
}
