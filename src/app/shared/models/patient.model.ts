export interface Address {
  phoneNumber: string;
  street: string;
  city: string;
  country: string;
  zip: string;
}

export interface Patient {
  firstName: string;
  lastName: string;
  birthDate: Date;
  registeredDate: Date;
  VATCode: string;
  email: string;
  doctor: number | any;
  homeAddress: Address;
  otherAddresses?: Address[];
}


