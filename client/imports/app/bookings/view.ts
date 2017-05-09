import { Meteor } from "meteor/meteor";
import {Component, OnDestroy, NgZone } from "@angular/core";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import { ChangeDetectorRef } from "@angular/core";
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
  isProcessing: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef
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

    if (! item.paymentInfo || item.paymentInfo.status != 'approved') {
      retVal = "Unpaid";
    } else if (item.cancelled == true && item.refunded !== true) {
      retVal = "Refund Requested";
    } else if (item.cancelled == true && item.refunded == true) {
      retVal = "Cancelled";
    } else if (item.confirmed !== true) {
        retVal = "Pending";
    } else if (item.confirmed === true && item.completed !== true) {
        retVal = "Confirmed";
    } else if (item.completed === true) {
        retVal = "Completed";
    }

    return retVal;
  }

  processRefund() {
    if (this.isProcessing) {
        showAlert("Your previous request is under processing. Please wait for a while.", "info");
        return false;
      }

      this.isProcessing = true;
      this.changeDetectorRef.detectChanges();
      let booking = this.booking;
      HTTP.call("POST", "/api/1.0/paypal/payment/refund", {
        data: {},
        params: {
          paymentId: booking.paymentInfo.gatewayTransId
        }
      }, (error, result) => {
        this.isProcessing = false;
        this.changeDetectorRef.detectChanges();
        let response = JSON.parse(result.content);
        if (! response.success) {
          showAlert("Error while processing refund request. Please review gateway configurations and try again after some time.", "danger");
          return;
        } else {
          booking.refunded = true;
          this.zone.run(() => {
            showAlert("Refund request has been processed successfully. Payment will be sent to customer based on processing time of gateway.", "success")
            this.router.navigate(['/bookings/list']);
          });
        }
      });
  }
}
