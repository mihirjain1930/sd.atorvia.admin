import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { check } from "meteor/check";
import { Tours } from "../../both/collections/tours.collection";
import { Bookings } from "../../both/collections/bookings.collection";
import { Tour } from "../../both/models/tour.model";
import * as _ from 'underscore';

interface Options {
  [key: string]: any;
}

Meteor.methods({
    "tours.find": (options: Options, criteria: any, searchString: string) => {
        let where:any = [];
        where.push({
            "$or": [{deleted: false}, {deleted: {$exists: false} }]
        }, {
          "$or": [{active: true}, {active: {$exists: false} }]
        });

        if (!_.isEmpty(criteria)) {
          where.push(criteria);
        }

        // match search string
        if (typeof searchString === 'string' && searchString.length) {
            // allow search on firstName, lastName
            where.push({
                "$or": [
                    { "name": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "departure": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "destination": { $regex: `.*${searchString}.*`, $options: 'i' } }
                ]
            });
        }

        let cursor = Tours.collection.find({$and: where}, options);
        return {count: cursor.count(), data: cursor.fetch()};
    },
    "tours.findOne": (criteria: any, options: {with?: {owner: boolean}}= {}) => {
      let where:any = [];
      where.push({
          "$or": [{deleted: false}, {deleted: {$exists: false} }]
      }, {
        "$or": [{active: true}, {active: {$exists: false} }]
      });
      if (_.isEmpty(criteria)) {
        criteria = { };
      }
      where.push(criteria);

      let tour = Tours.collection.findOne({$and: where});

      if (typeof options.with == "undefined") {
        return tour;
      }

      if (options.with.owner == true) {
        let owner = Meteor.users.findOne({_id: tour.owner.id}, {fields: {profile: 1} });
        let numOfTours = Tours.collection.find({"owner.id": tour.owner.id, "approved": true, "active": true, "deleted": false}).count();
        return {tour, owner, numOfTours};
      }
    },
    "tours.count": ( criteria: any, searchString: string ) => {
      let where:any = [];
      where.push({
          "$or": [{deleted: false}, {deleted: {$exists: false} }]
      }, {
        "$or": [{active: true}, {active: {$exists: false} }]
      });

      if (_.isEmpty(criteria)) {
        criteria = { };
      }
      criteria.approved = true;
      where.push(criteria);

      // match search string
      if (typeof searchString === 'string' && searchString.length) {
          // allow search on firstName, lastName
          where.push({
              "$or": [
                  { "name": { $regex: `.*${searchString}.*`, $options: 'i' } },
                  { "departure": { $regex: `.*${searchString}.*`, $options: 'i' } },
                  { "destination": { $regex: `.*${searchString}.*`, $options: 'i' } }
              ]
          });
      }

      let approvedCount =  Tours.collection.find({$and: where}).count();

      // find pending count
      criteria.approved = false;
      let pendingCount =  Tours.collection.find({$and: where}).count();
      let count = { };
      count["approvedCount"] = approvedCount;
      count["pendingCount"] = pendingCount;
      return count;
    },
    "tours.delete": (id: string) => {
      let tour = Tours.collection.findOne({_id: id});
      if (_.isEmpty(tour)) {
          throw new Meteor.Error(`Invalid tour-id "${id}"`);
      }

      /* reset data in collections */
      Tours.collection.update({_id: tour._id}, {$set : {deleted: true } });
    },
    "tours.update": (data: Tour, id: string) => {
      data.modifiedAt = new Date();
      return Tours.collection.update({_id: id}, {$set: data});
    },
    "tours.approve": (id: string) => {
      let tour = Tours.collection.findOne({_id: id});
      if (_.isEmpty(tour)) {
          throw new Meteor.Error(`Invalid tour-id "${id}"`);
      }

      /* reset data in collections */
      Tours.collection.update({_id: tour._id}, {$set : {approved: true } });
    },
    "tours.deactivate": (id: string) => {
      let tour = Tours.collection.findOne({_id: id});
      if (_.isEmpty(tour)) {
          throw new Meteor.Error(`Invalid tour-id "${id}"`);
      }

      /* reset data in collections */
      Tours.collection.update({_id: tour._id}, {$set : {active: false } });
    },
    "tours.activate": (id: string) => {
      let tour = Tours.collection.findOne({_id: id});
      if (_.isEmpty(tour)) {
          throw new Meteor.Error(`Invalid tour-id "${id}"`);
      }

      /* reset data in collections */
      Tours.collection.update({_id: tour._id}, {$set : {active: true } });
    },
    "tours.updateUser": (userId: string) => {
      let user = Meteor.users.findOne({_id: userId});
      if (_.isEmpty(user)) {
        console.log("Error calling bookings.updateUser(). Invalid userId supplied.")
        return;
      }

      Tours.collection.update({"owner.id": userId}, {
        $set: {
          "owner.agentIdentity": {verified: user.profile.supplier.agentIdentity.verified},
          "owner.agentCertificate": {verified: user.profile.supplier.agentCertificate.verified}
        }
      }, {
        multi: true
      });

      Bookings.collection.update({"tour.supplierId": userId}, {
        $set: {
          "tour.supplier.agentIdentity": {verified: user.profile.supplier.agentIdentity.verified},
          "tour.supplier.agentCertificate": {verified: user.profile.supplier.agentCertificate.verified}
        }
      }, {
        multi: true
      });
    }
});
