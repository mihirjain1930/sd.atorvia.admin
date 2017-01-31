import { MongoObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
import { Patient } from "../models/patient.model";

export const Patients = new MongoObservable.Collection("patients");
//export const Appointments = new MongoObservable.Collection("appointments");
