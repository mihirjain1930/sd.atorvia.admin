import { Meteor } from "meteor/meteor";
import {Component, OnDestroy, NgZone } from "@angular/core";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import { Booking } from "../../../../both/models/booking.model";
import { User } from "../../../../both/models/user.model";
import {showAlert} from "../shared/show-alert";

import template from './view.html';

declare var jQuery:any;

@Component({
  selector: '',
  template
})
export class ViewBookingComponent extends MeteorComponent {
  booking: Booking;
  paramsSub: Subscription;
  bookingId: string;
  owner: User;
  error: string;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
  ) {
    super();
  }

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['id'])
      .subscribe(id => {
          this.bookingId = id;
          //console.log("patientId:", patientId);

          this.call("bookings.findOne", {_id: id}, {with: {tour: true}}, (err, res)=> {
              if (err || typeof res == "undefined" || typeof res.booking == "undefined" || res.booking._id !== id) {
                  showAlert("Error while fetching tour data.", "danger");
                  this.zone.run(() => {
                    this.router.navigate(['/bookings/list']);
                  });
                  return;
              }
              this.booking = <Booking>res.booking;
              this.owner = <User>res.owner;
          });
      });

    this.error = '';
  }

  getBookingStatus(item) {
    let retVal = null;

    // check completed flag
    if (new Date(item.startDate) < new Date()) {
      item.completed = true;
    }

    if (item.confirmed !== true && item.cancelled !== true) {
        retVal = "Pending";
    } else if (item.confirmed === true && item.completed !== true) {
        retVal = "Confirmed";
    } else if (item.completed === true) {
        retVal = "Completed";
    } else if (item.confirmed !== true && item.cancelled === true) {
      retVal = "Cancelled";
    }

    return retVal;
  }
}
