import {Component, OnDestroy, OnInit} from '@angular/core';
import {FacadePatientService, TableColumn, TableColumnType} from '../../../shared';
import {combineLatest, Subscription} from 'rxjs';
import {Doctor, Patient} from '../../../shared/models';

interface PatientTableData {
  firstName: string;
  lastName: string;
  registeredDate: Date;
  doctorName: string;
  homeAddress: string;
}

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit, OnDestroy {

  readonly PATIENT_LIST_TABLE_TITLE = 'List of patients';

  subscriptions: Subscription[] = [];

  dataSource: PatientTableData[] = [];

  readonly visibleColumns: TableColumn[] = [
    { label: 'First name', type: TableColumnType.TEXT, field: 'firstName'},
    { label: 'Last name', type: TableColumnType.TEXT, field: 'lastName' },
    { label: 'Registration date', type: TableColumnType.DATE, field: 'registeredDate' },
    { label: 'Doctor\'s name', type: TableColumnType.TEXT, field: 'doctorName' },
    { label: 'Home address', type: TableColumnType.TEXT, field: 'homeAddress' },
  ];

  constructor(
    private readonly facadePatientService: FacadePatientService,
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

    patientTableData.firstName = patient.firstName;
    patientTableData.lastName = patient.lastName;
    patientTableData.homeAddress = this.getHomeAddressColumnData(patient);
    patientTableData.registeredDate = patient.registeredDate;
    patientTableData.doctorName = doctor.firstName + ' ' + doctor.lastName;

    return patientTableData as PatientTableData;
  }

  getHomeAddressColumnData(patient: Patient): string {
    if (!patient.homeAddress) {
      return '';
    }
    return `${patient.homeAddress.street} ${patient.homeAddress.city} ${patient.homeAddress.zip} ${patient.homeAddress.country}`;
  }

}
