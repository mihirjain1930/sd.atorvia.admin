import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

interface Options {
  [key: string]: any;
}

Meteor.methods({
    "users.insert": (userData: {email: string, passwd: string, profile?: any}, roles: [string]): string => {
        let userId = Accounts.createUser({
            email: userData.email,
            password: userData.passwd,
            profile: userData.profile
        });

        Roles.addUsersToRoles(userId, roles);

        return userId;
    },
    "users.find": (options: Options, criteria: {roles: [string]}, searchString: string) => {
        let where:any = [];
        where.push({
            "$or": [{deleted: false}, {deleted: {$exists: false} }]
        });
        // match user roles
        if (typeof criteria.roles !== "undefined") {
            where.push({"roles": {$in: criteria.roles} });
        }
        // match search string
        if (typeof searchString === 'string' && searchString.length) {
            // allow search on firstName, lastName
            where.push({"$or": [
                {"profile.firstName": {$regex: `.*${searchString}.*`,$options : 'i'} },
                {"profile.lastName": {$regex: `.*${searchString}.*`,$options : 'i'} }
            ]} );
        }

        // restrict db fields to return
        _.extend(options, {
            //fields: {"emails.address": 1, "patient": 1, "createdAt": 1, "status": 1}
        });

        //console.log("where:", where);
        //console.log("options:", options);
        // execute find query
        let cursor = Meteor.users.find({$and: where}, options);
        return {count: cursor.count(), data: cursor.fetch()};
    },
    "users.findOne": (userId: string) => {
        return Meteor.users.findOne({_id: userId});
    },
    "users.update": (userId: string, userData: any) => {
        return Meteor.users.update({_id: userId}, {$set: {
            "profile.firstName": userData.profile.firstName,
            "profile.lastName": userData.profile.lastName,
            "profile.phoneNum": userData.profile.phoneNum,
            "roles": userData.roles
        }});
    },
    "users.delete": (userId: string) => {
        return Meteor.users.update({_id: userId}, {$set: {
            "deleted": true
        }});
    }
})