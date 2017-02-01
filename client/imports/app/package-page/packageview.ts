import { Meteor } from 'meteor/meteor';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import { Subscription } from "rxjs";
import { Package } from "../../../../both/models/package.model";
import {showAlert} from "../shared/show-alert";

import template from "./packageview.html";

@Component({
  selector: '',
  template
})
export class ViewPackageComponent extends MeteorComponent implements OnInit, OnDestroy {
  paramsSub: Subscription;
  packageId: string;
  package: Package;
  error: string;

  constructor(
      private router: Router, 
      private route: ActivatedRoute, 
      private zone: NgZone
  ) {
    super();
  }

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['id'])
      .subscribe(id => {
          this.packageId = id;
          //console.log("packageId:", packageId);
  
          if (! this.packageId) {
            showAlert("Invalid package-id supplied.");
            return;
          }

          this.call("packages.findOne", id, (err, res)=> {
              if (err) {
                  //console.log("error while fetching package data:", err);
                  showAlert("Error while fetching package data.", "danger");
                  return;
              }

              this.package = res;
          });

      });

    this.error = '';
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}