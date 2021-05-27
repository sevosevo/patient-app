import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeAheadInputComponent } from './type-ahead-input.component';

describe('TypeAheadInputComponent', () => {
  let component: TypeAheadInputComponent;
  let fixture: ComponentFixture<TypeAheadInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeAheadInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeAheadInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
