import { Meteor } from "meteor/meteor";
import {Component, OnDestroy, NgZone } from "@angular/core";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import { Tour } from "../../../../both/models/tour.model";
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
          this.tourId = id;
          //console.log("patientId:", patientId);

          this.call("tours.findOne", {_id: id}, (err, res)=> {
              if (err || typeof res == "undefined" || res._id !== id) {
                  showAlert("Error while fetching tour data.", "danger");
                  this.zone.run(() => {
                    this.router.navigate(['/tours/list']);
                  });
                  return;
              }
              this.tour = res;
          });
      });

    this.error = '';
  }
}
