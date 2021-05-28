import {Component, Input, OnInit, Optional, Self} from '@angular/core';
import {ControlValueAccessor, FormControl, FormGroupDirective, NgControl, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

export interface TypeAheadInputOption {
  [key: string]: any;
}

@Component({
  selector: 'patient-app-type-ahead-input',
  templateUrl: './type-ahead-input.component.html',
  styleUrls: ['./type-ahead-input.component.css']
})
export class TypeAheadInputComponent implements ControlValueAccessor, OnInit, ErrorStateMatcher {
  @Input() label: string;
  @Input() placeholder: string;
  @Input() options: TypeAheadInputOption[];
  @Input() optionKey: string;

  @Input()
  errorToMessageMap: Record<string, string> = {};

  filteredOptions: Observable<TypeAheadInputOption[]>;

  inputControl: FormControl = new FormControl(null);

  constructor(@Optional() @Self() public ngControl: NgControl) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    this.filteredOptions = this.inputControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value[this.optionKey]),
        map(name => name ? this._filter(name) : this.options.slice())
      );
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

  registerOnTouched(fn: () => void): void {
  }

  writeValue(val: unknown): void {
    this.inputControl.setValue(val);
  }

  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return (control.touched || control.dirty) && this.ngControl.invalid;
  }

  private _filter(name: string): TypeAheadInputOption[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option[this.optionKey].toLowerCase().indexOf(filterValue) === 0);
  }

}
