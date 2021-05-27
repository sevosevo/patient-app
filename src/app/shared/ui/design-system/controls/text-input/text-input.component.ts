import {Component, Input, OnInit, Optional, Self} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroupDirective,
  NgControl,
  NgForm,
} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';

@Component({
  selector: 'patient-app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
})
export class TextInputComponent implements ControlValueAccessor, OnInit, ErrorStateMatcher {

  @Input() label: string;
  @Input() placeholder: string;

  @Input()
  errorToMessageMap: Record<string, string> = {};

  inputControl: FormControl = new FormControl(null);

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
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

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return (
      !!(control && control.invalid && (control.dirty || control.touched)) ||
      (this.ngControl &&
        this.ngControl.invalid &&
        (this.ngControl.dirty || this.ngControl.touched))
    );
  }

}
