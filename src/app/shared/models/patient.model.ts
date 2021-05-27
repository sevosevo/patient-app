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
  country: string;
  zipcode: string;
  type: AddressType;
  email: string;
  phone: string;
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: Date;
  registeredDate: Date;
  VATCode: string;
  email: string;
  doctor: number | any;
  addresses: Address[];
}


