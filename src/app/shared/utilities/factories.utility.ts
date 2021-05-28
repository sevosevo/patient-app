import {Patient} from '../models';

export const patientFactory = (patient: Partial<Patient>, doctorId: number, prevId: number): Patient => ({
  ...patient,
  registeredDate: new Date().toISOString(),
  doctor: doctorId,
  id: prevId++,
} as Patient);
