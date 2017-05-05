import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
    "fetchStats": () => {
      let activeSuppliers = Meteor.call("users.count",{"roles": "supplier","active": true}, "");
      let inactiveSuppliers = Meteor.call("users.count",{"roles": "supplier","active": false}, "");
      let activeCustomers = Meteor.call("users.count",{"roles": "customer","active": true}, "");
      let inactiveCustomers = Meteor.call("users.count",{"roles": "customer","active": false}, "");
      let totalTours = Meteor.call("tours.find", {}, {}, "", true);
      let approvedTours = Meteor.call("tours.find", {}, {"approved": true}, "", true);
      let totalBookings = Meteor.call("bookings.find",{}, {}, "", true);
      let confirmedBooking = Meteor.call("bookings.find",{}, {"confirmed": true}, "", true);
      let nowDate = new Date();
      let lastMonth = new Date(nowDate.setMonth(nowDate.getMonth() - 1));
      let sixMonths = new Date(nowDate.setMonth(nowDate.getMonth() - 6));
      let criteria = {
        bookingDate: {
          $gte: lastMonth,
          $lte: new Date()
        }
      };
      let lastMonthSales = Meteor.call("bookings.statistics.new", criteria);

      criteria = {
        bookingDate: {
          $gte: sixMonths,
          $lte: new Date()
        }
      };
      let last6MonthsSales = Meteor.call("bookings.statistics.new", criteria);

      return {
        activeSuppliers,
        inactiveSuppliers,
        activeCustomers,
        inactiveCustomers,
        totalTours,
        approvedTours,
        totalBookings,
        confirmedBooking,
        lastMonthSales,
        last6MonthsSales
      };
    }
})
