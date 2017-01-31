import { CollectionObject } from './collection-object.model';

export interface Patient extends CollectionObject {
    firstName: string;
    lastName: string;
    email: string;
    phonenumber: string;
    dob: Date;
    height: number;
    weight: number;
    occupation: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    gender: number;
    practitioner: string;
    dobtimestamp: number;
    deleted: boolean;
    active: boolean;
}