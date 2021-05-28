import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AddPatientComponent, FacadePatientService, getFullName, LinkTableColumn, TableColumn, TableColumnType} from '../../../shared';
import {combineLatest, Subscription} from 'rxjs';
import {Address, AddressType, Doctor, Patient} from '../../../shared/models';
import {MatDialog, MatDialogRef} from '@angular/material';

interface PatientTableData {
  id: number;
  firstName: string;
  lastName: string;
  registeredDate: Date | string;
  doctorName: string;
  homeAddress: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, OnDestroy {
  @ViewChild('showPatientTemplate', { static: true }) showPatientTemplate: TemplateRef<PatientListComponent>;
  @ViewChild(AddPatientComponent, { static: false }) AddPatientFormComponent: AddPatientComponent;

  readonly PAGE_SIZE = 4;

  readonly PATIENT_LIST_TABLE_TITLE = 'List of patients';
  readonly SHOW_PATIENT_TITLE = 'Patient details';

  dialogRef: MatDialogRef<PatientListComponent>;

  patient: Patient;

  subscriptions: Subscription[] = [];

  dataSource: PatientTableData[] = [];

  readonly visibleColumns: TableColumn[] = [
    { label: 'Id', type: TableColumnType.TEXT, field: 'id', visible: false, },
    { label: 'First name', type: TableColumnType.TEXT, field: 'firstName', visible: true, },
    { label: 'Last name', type: TableColumnType.TEXT, field: 'lastName', visible: true, },
    { label: 'Registration date', type: TableColumnType.DATE, field: 'registeredDate', visible: true },
    { label: 'Doctor\'s name', type: TableColumnType.TEXT, field: 'doctorName', visible: true, },
    { label: 'Phone', type: TableColumnType.TEXT, field: 'phone', visible: true },
    { label: 'Home address', type: TableColumnType.TEXT, field: 'homeAddress', visible: true, },
    { label: 'Email', type: TableColumnType.LINK, field: 'email', href: this.createMailToHref, visible: true } as LinkTableColumn,
  ];

  constructor(
    private readonly facadePatientService: FacadePatientService,
    private readonly dialog: MatDialog,
  ) { }

  createMailToHref(row: PatientTableData) {
    return `mailto:${row.email}?subject=Subject example&body=Body example`;
  }

  ngOnInit() {
    const subscription = this.updateDataSource();
    this.subscriptions.push(subscription);
  }

  handleBackButtonClick() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  updateDataSource(): Subscription {
    return combineLatest([this.facadePatientService.patients$, this.facadePatientService.doctors$])
      .subscribe(([patients, doctors]) => {
        const patientsCopy = [...patients.map(patient => ({ ...patient }))];
        const doctorsCopy = [...doctors.map(doctor => ({ ...doctor }))];
        const patientTableDataSource = [];

        patientsCopy.forEach(patient => {
          patientTableDataSource.push(this.createPatientTableData(
            patient,
            doctorsCopy.find(doctor => doctor.id === patient.doctor),
          ));
        });

        this.dataSource = patientTableDataSource;
      });
  }

  createPatientTableData(patient: Patient, doctor: Doctor): PatientTableData {
    const patientTableData: Partial<PatientTableData> = {};

    patientTableData.id = patient.id;
    patientTableData.firstName = patient.firstName;
    patientTableData.lastName = patient.lastName;
    patientTableData.email = patient.email;
    patientTableData.homeAddress = this.getHomeAddressColumnData(patient);
    patientTableData.registeredDate = patient.registeredDate;
    patientTableData.doctorName = getFullName(doctor.firstName, doctor.lastName);
    patientTableData.phone = this.getHomeAddress(patient).phone;

    return patientTableData as PatientTableData;
  }

  getHomeAddressColumnData(patient: Patient): string {
    const homeAddress = this.getHomeAddress(patient);
    if (!homeAddress) {
      return '';
    }
    return `${homeAddress.street} ${homeAddress.city} ${homeAddress.zipcode} ${homeAddress.country}`;
  }

  handleTableRowClicked(row: PatientTableData) {
    this.facadePatientService.patients$.subscribe(patients => this.patient = { ...patients.find(patient => patient.id === row.id) });
    this.patient.doctor = row.doctorName;

    this.dialogRef = this.dialog.open(this.showPatientTemplate, { width: '600px', height: '600px' });
    this.disableAllFormFields();
  }

  disableAllFormFields() {
    setTimeout(() => {
      this.AddPatientFormComponent.patientFormGroup.disable();
    });
  }

  private getHomeAddress(patient: Patient): Address {
    return (patient.addresses || []).find(address => address.type === AddressType.HOME);
  }

}
