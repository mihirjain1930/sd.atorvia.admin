import { Meteor } from "meteor/meteor";
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { check } from "meteor/check";
import { Payouts } from "../../both/collections/payouts.collection";
import { Payout } from "../../both/models/payout.model";
import * as _ from 'underscore';

Meteor.methods({
  "payouts.insert": (payout: Payout) => {
    let payoutId = Payouts.collection.insert(payout);
    return payoutId;
  }
})
