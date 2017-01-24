import { Meteor } from 'meteor/meteor';

export interface User extends Meteor.User {
    profile: {
        firstName: string;
        lastName: string;
        contact: string;
    },
    active: boolean,
    deleted: boolean;
}
