import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { check } from "meteor/check";
import { Packages } from "../../both/collections/packages.collection";
import { Package } from "../../both/models/package.model";
import { isValidSlug } from "../../both/validators";

interface Options {
    [key: string]: any;
}

Meteor.methods({
    "packages.insert": (packageData: Package) => {
        if (!(packageData)) {
            throw new Meteor.Error(`Invalid formData supplied.`);
        }
        let packageId = Packages.collection.insert(packageData);

        return packageId;
    },
    "packages.update": (packageId: string, packageData: Package) => {
        if (!(packageData)) {
            throw new Meteor.Error(`Invalid formData supplied.`);
        }
        return Packages.collection.update({ _id: packageId }, { $set: packageData });
    },
    "packages.find": (options: Options, criteria: any, searchString: string) => {
        let where: any = [];
        where.push({
            "$or": [{ deleted: false }, { deleted: { $exists: false } }]
        });

        if (typeof searchString === 'string' && searchString.length) {
            where.push({
                "$or": [
                    { "title": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "heading": { $regex: `.*${searchString}.*`, $options: 'i' } },
                ]
            });
        }

        let cursor = Packages.collection.find({ $and: where }, options);
        return { count: cursor.count(), data: cursor.fetch() };
    },
    "packages.findOne": (packageId: string) => {
        return Packages.collection.findOne({ _id: packageId });
    },
    "packages.delete": (packageId: string) => {
        return Packages.collection.update({ _id: packageId }, {
            $set: {
                deleted: true
            }
        });
    }
});
