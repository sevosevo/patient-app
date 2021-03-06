import {Doctor} from './doctor.model';

export enum AddressType {
  HOME = 'HOME',
  WORK = 'WORK',
  SECOND_HOME = 'SECOND HOME',
  HOLIDAY_PLACE = 'HOLIDAY PLACE',
  CLOSE_RELATIVE = 'CLOSE RELATIVE',
}

export interface Address {
  phoneNumber: string;
  street: string;
  city: string;
  name?: string;
  country: string;
  zipcode: string;
  type: AddressType;
  phone: string;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date | string;
  registeredDate: Date | string;
  VATCode: string;
  email: string;
  doctor: string | number | Doctor;
  addresses: Address[];
}


