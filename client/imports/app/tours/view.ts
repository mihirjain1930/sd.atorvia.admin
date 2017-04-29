import { Meteor } from "meteor/meteor";
import {Component, OnDestroy, NgZone } from "@angular/core";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import { ChangeDetectorRef } from "@angular/core";
import { Tour } from "../../../../both/models/tour.model";
import { User } from "../../../../both/models/user.model";
import {showAlert} from "../shared/show-alert";

import template from './view.html';

declare var jQuery:any;

@Component({
  selector: '',
  template
})
export class ViewTourComponent extends MeteorComponent {
  tour: Tour;
  paramsSub: Subscription;
  tourId: string;
  owner: User;
  error: string;
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
          this.tourId = id;
          //console.log("patientId:", patientId);

          this.call("tours.findOne", {_id: id}, {with: {owner: true}}, (err, res)=> {
              if (err || typeof res == "undefined" || typeof res.tour == "undefined" || res.tour._id !== id) {
                  showAlert("Error while fetching tour data.", "danger");
                  this.zone.run(() => {
                    this.router.navigate(['/tours/list']);
                  });
                  return;
              }
              this.tour = <Tour>res.tour;
              this.owner = <User>res.owner;
          });
      });

    this.error = '';
  }

  activate(tour: Tour) {
    if (! confirm("Are you sure to activate this tour?")) {
      return false;
    }

    Meteor.call("tours.activate", tour._id, (err, res) => {
      if (err) {
        showAlert("Error calling tours.activate", "danger");
        return;
      }
      tour.active = true;
      //angular2 waits for dom event to detect changes automatically
      //so trigger change detection manually to update dom
      this.changeDetectorRef.detectChanges();
      showAlert("Tour has been activated.", "success");
    })
  }

  approveTour(tour: Tour) {
    if (! confirm("Are you sure to approve this tour?")) {
      return false;
    }

    Meteor.call("tours.approve", tour._id, (err, res) => {
      if (err) {
        showAlert("Error calling tours.approved", "danger");
        return;
      }
      tour.approved = true;
      //angular2 waits for dom event to detect changes automatically
      //so trigger change detection manually to update dom
      this.changeDetectorRef.detectChanges();
      showAlert("Tour has been approved.", "success");
    })
  }

  deactivate(tour: Tour) {
    if (! confirm("Are you sure to deactivate this tour?")) {
      return false;
    }

    Meteor.call("tours.deactivate", tour._id, (err, res) => {
      if (err) {
        showAlert("Error calling tours.deactivate", "danger");
        return;
      }
      tour.active = false;
      //angular2 waits for dom event to detect changes automatically
      //so trigger change detection manually to update dom
      this.changeDetectorRef.detectChanges();
      showAlert("Tour has been deactivated.", "success");
    })
  }

  deleteTour(tour: Tour) {
    if (! confirm("Are you sure to delete this tour?")) {
      return false;
    }
    // console.log(tour._id);
    Meteor.call("tours.delete", tour._id, (err, res) => {
      if (err) {
        showAlert("Error calling tours.delete", "danger");
        return;
      }
      //set user.deleted to true to remove from list
      tour.deleted = true;
      //angular2 waits for dom event to detect changes automatically
      //so trigger change detection manually to update dom
      this.changeDetectorRef.detectChanges();
      showAlert("Tour has been removed.", "success");
    })
  }
}
