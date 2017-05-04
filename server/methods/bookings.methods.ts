import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { check } from "meteor/check";
import { Bookings } from "../../both/collections/bookings.collection";
import { Booking } from "../../both/models/booking.model";
import * as _ from 'underscore';

interface Options {
  [key: string]: any;
}

Meteor.methods({
    "bookings.find": (options: Options, criteria: any, searchString: string, count: boolean = false) => {
        let where:any = [];
        let userId = Meteor.userId();
        where.push({
            "$or": [{deleted: false}, {deleted: {$exists: false} }]
        }, {
          "$or": [{active: true}, {active: {$exists: false} }]
        });

        if ( !_.isEmpty(criteria) ) {
          if ( criteria.confirmed == false ) {
            criteria.startDate = {$gt: new Date()};
          } else if ( criteria.completed==true ) {
            criteria.startDate = {$lte: new Date()};
            delete criteria["completed"];
          } else if ( criteria.completed==false && criteria.confirmed==true ) {
            criteria.startDate = {$gt: new Date()};
            delete criteria["completed"];
          }
          //console.log(criteria);
          where.push(criteria);
        }

        // match search string
        if (isNaN(searchString) == false && searchString.length) {
          searchString = Number(searchString);
          where.push({
              "$or": [{uniqueId: searchString}]
          });
        } else if (typeof searchString === 'string' && searchString.length) {
            // allow search on firstName, lastName
            where.push({
                "$or": [
                    { "tour.name": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "tour.supplier.companyName": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "user.firstName": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "user.lastName": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "travellers.firstName": { $regex: `.*${searchString}.*`, $options: 'i' } },
                    { "travellers.lastName": { $regex: `.*${searchString}.*`, $options: 'i' } }
                ]
            });
        }
        let cursor = Bookings.collection.find({$and: where}, options);

        if (count === true) {
          return cursor.count();
        }

        return {count: cursor.count(), data: cursor.fetch()};
    },
    "bookings.findOne": (criteria: any, options: {with?: {tour: boolean}}= {}) => {
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
      let booking = Bookings.collection.findOne({$and: where});

      if (typeof options.with == "undefined") {
        return booking;
      }

      if (options.with.tour == true) {
        let owner = Meteor.users.findOne({_id: booking.tour.supplierId}, {fields: {profile: 1} });
        return {booking, owner};
      }
    },
    "bookings.count": () => {
      let bookingsCount: any = {};
      bookingsCount.new = Meteor.call("bookings.find", {}, {"confirmed": false, "cancelled": false}, "", true);
      bookingsCount.pending = Meteor.call("bookings.find", {}, {"confirmed": true, "completed": false}, "", true);
      bookingsCount.completed = Meteor.call("bookings.find", {}, {"confirmed": true, "completed": true}, "", true);

      return bookingsCount;
    },
    "bookings.statistics":(id: string) => {
      let data = Bookings.collection.aggregate([{
        "$project":
          {
            "tour.supplierId":1,
            "totalPrice":1,
            "month": {"$month":"$bookingDate"},
            "year": {"$year": "$bookingDate"}
          }},
        {
          "$match":
            {
              "tour.supplierId": id
            }
        },
        {
          "$group":
            {
              _id:{"month":"$month","year":"$year"},
              "totalPrice":{"$sum":"$totalPrice"},
              "count":{"$sum":1}
            }
        }
      ])
      return data;
    },
    "bookings.statistics.new":(criteria: any = {}) => {
      let _id: any = {"year":"$year","month":"$month"};
      let data = Bookings.collection.aggregate([
        {
          "$match":
          {
            "confirmed": true
          }},
          {
            "$project":
            {
              "tour.supplierId":1,
              "totalPrice":1,
              "month": {"$month":"$bookingDate"},
              "year": {"$year": "$bookingDate"},
              "bookingDate": 1
            }},
            {
              "$match": criteria
            },
            {
              "$group":
              {
                _id: "$confirmed",
                "totalPrice":{"$sum":"$totalPrice"},
                "count":{"$sum":1}
              }},
              {
                "$sort":
                {
                  "_id.year": 1, "_id.month": 1
                }}
              ])
              return data;
            }

});
