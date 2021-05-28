import {Component, Input, OnInit, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroupDirective, NgControl, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';

@Component({
  selector: 'patient-app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent implements ControlValueAccessor, ErrorStateMatcher, OnInit {
  @Input() placeholder: string;
  @Input() label: string;

  maxDate!: Date;

  private onChange: (obj: Date) => void;
  private onTouch: () => void;

  @Input()
  errorToMessageMap: Record<string, string> = {};

  inputControl: FormControl = new FormControl(null);

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.getMaxDate();
  }

  getMaxDate() {
    this.maxDate = new Date(Date.now());
  }

  writeValue(obj: Date): void {
    this.inputControl.setValue(obj);
  }

  registerOnChange(fn: (obj: Date) => void): void {
    this.inputControl.valueChanges.subscribe(fn);
  }

  setDisabledState(isDisabled: boolean) {
    if (isDisabled) {
      this.inputControl.disable();
    } else {
      this.inputControl.enable();
    }
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return (control.touched || control.dirty) && this.ngControl.invalid;
  }

}
