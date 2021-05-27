import {Component, OnDestroy, OnInit} from '@angular/core';
import {FacadePatientService, LinkTableColumn, TableColumn, TableColumnType} from '../../../shared';
import {combineLatest, Subscription} from 'rxjs';
import {Address, AddressType, Doctor, Patient} from '../../../shared/models';
import {MatDialog} from '@angular/material';
import {ShowPatientComponent} from './show-patient';

interface PatientTableData {
  id: number;
  firstName: string;
  lastName: string;
  registeredDate: Date;
  doctorName: string;
  homeAddress: string;
  email: string;
}

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, OnDestroy {

  readonly mailToHref = `mailto:patient-app@gmail.com?subject=Hi&body=Hello this is mock message`;

  readonly PAGE_SIZE = 4;

  readonly PATIENT_LIST_TABLE_TITLE = 'List of patients';

  subscriptions: Subscription[] = [];

  dataSource: PatientTableData[] = [];

  readonly visibleColumns: TableColumn[] = [
    { label: 'Id', type: TableColumnType.TEXT, field: 'id', visible: false, },
    { label: 'First name', type: TableColumnType.TEXT, field: 'firstName', visible: true, },
    { label: 'Last name', type: TableColumnType.TEXT, field: 'lastName', visible: true, },
    { label: 'Registration date', type: TableColumnType.DATE, field: 'registeredDate', visible: true },
    { label: 'Doctor\'s name', type: TableColumnType.TEXT, field: 'doctorName', visible: true, },
    { label: 'Home address', type: TableColumnType.TEXT, field: 'homeAddress', visible: true, },
    { label: 'Email', type: TableColumnType.LINK, field: 'email', href: this.mailToHref, visible: true } as LinkTableColumn,
  ];

  constructor(
    private readonly facadePatientService: FacadePatientService,
    private readonly dialog: MatDialog,
  ) { }

  ngOnInit() {
    const subscription = this.updateDataSource();
    this.subscriptions.push(subscription);
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
    patientTableData.homeAddress = this.getHomeAddressColumnData(patient);
    patientTableData.registeredDate = patient.registeredDate;
    patientTableData.doctorName = doctor.firstName + ' ' + doctor.lastName;
    patientTableData.email = this.getHomeAddress(patient).email;

    return patientTableData as PatientTableData;
  }

  getHomeAddressColumnData(patient: Patient): string {
    const homeAddress = this.getHomeAddress(patient);
    return `${homeAddress.street} ${homeAddress.city} ${homeAddress.zipcode} ${homeAddress.country}`;
  }

  handleTableRowClicked(row: PatientTableData) {
    this.dialog.open(ShowPatientComponent, { width: '600px', height: '600px', data: row.id })
      .afterClosed()
      .subscribe();
  }

  private getHomeAddress(patient: Patient): Address {
    return patient.addresses.find(address => address.type === AddressType.HOME);
  }

}
