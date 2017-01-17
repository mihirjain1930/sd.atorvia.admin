import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

Meteor.methods({
    "users.insert": (userData: {email: string, passwd: string, profile?: any}, roles: [string]): string => {
        let userId = Accounts.createUser({
            email: userData.email,
            password: userData.passwd,
            profile: userData.profile
        });

        Roles.addUsersToRoles(userId, roles);

        return userId;
    }
})