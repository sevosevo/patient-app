import { Component, Input } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'patient-app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DatePickerComponent,
      multi: true,
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor {
  value: Date = new Date();
  isDisabled = false;
  @Input() placeholder: string;
  @Input() label: string;

  private onChange: (obj: Date) => void;
  private onTouch: () => void;

  writeValue(obj: Date): void {
    this.value = obj;
  }
  registerOnChange(fn: (obj: Date) => void): void {
    this.onChange = fn;
  }
  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  dateValueChanged(): void {
    this.onChange(this.value);
  }
}
