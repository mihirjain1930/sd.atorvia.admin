import { Meteor } from "meteor/meteor";
import { Patients } from "../../both/collections/patients.collection";
import { Patient } from "../../both/models/patient.model";
import * as _ from 'underscore';

interface Options {
  [key: string]: any;
}

Meteor.methods({
    "patients.find": (options: Options, criteria: {roles: [string]}, searchString: string) => {
        let where:any = [];
        where.push({
            "$or": [{deleted: false}, {deleted: {$exists: false} }]
        });
        // match search string
        if (typeof searchString === 'string' && searchString.length) {
            // allow search on firstName, lastName
            where.push({"$or": [
                {"firstName": {$regex: `.*${searchString}.*`,$options : 'i'} },
                {"lastName": {$regex: `.*${searchString}.*`,$options : 'i'} }
            ]} );
        }

        // restrict db fields to return
        _.extend(options, {
            //fields: {"email": 1, "firstName": 1, "lastName": 1, "status": 1}
        });

        //console.log("where:", where);
        //console.log("options:", options);
        // execute find query
        let cursor = Patients.collection.find({$and: where}, options);
        return {count: cursor.count(), data: cursor.fetch()};
    },
})