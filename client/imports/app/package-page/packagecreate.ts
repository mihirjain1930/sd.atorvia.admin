import { Meteor } from 'meteor/meteor';
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import { Subscription } from "rxjs";
import { Package } from "../../../../both/models/package.model";
import {DropdownModule} from "ng2-dropdown";
import {showAlert} from "../shared/show-alert";
import {validateSlug} from "../../validators/common";
import { Roles } from 'meteor/alanning:roles';

import template from "./packagecreate.html";

@Component({
  selector: '',
  template
})
export class CreatePackageComponent extends MeteorComponent implements OnInit, OnDestroy {
  paramsSub: Subscription;
  packageId: string;
  packageForm: FormGroup;
  error: string;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private zone: NgZone,
      private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['id'])
      .subscribe(id => {
          this.packageId = id;
          //console.log("patientId:", patientId);

          if (! this.packageId) {
            //console.log("no page-id supplied");
            return;
          }

          this.call("packages.findOne", id, (err, res)=> {
              if (err) {
                  //console.log("error while fetching patient data:", err);
                  showAlert("Error while fetching package data.", "danger");
                  return;
              }
              this.packageForm.controls['title'].setValue(res.title);
              this.packageForm.controls['code'].setValue(res.code);
              this.packageForm.controls['summary'].setValue(res.summary);
              this.packageForm.controls['maxDevices'].setValue(res.maxDevices);
              this.packageForm.controls['maxPatients'].setValue(res.maxPatients);
              this.packageForm.controls['pricePerPatient'].setValue(res.pricePerPatient);
              this.packageForm.controls['pricePerDevice'].setValue(res.pricePerDevice);
              this.packageForm.controls['durationInMonth'].setValue(res.durationInMonth),
              this.packageForm.controls['durationInDays'].setValue(res.durationInDays)
          });

      });

    this.packageForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(255),Validators.pattern("[a-zA-Z][a-zA-Z ]*")])],
      code: ['', Validators.compose([Validators.required,Validators.pattern("[a-zA-Z0-9]{1,30}")])],
      summary: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(255),Validators.pattern("[a-zA-Z][a-zA-Z ]*")])],
      maxDevices: ['', Validators.compose([Validators.required,Validators.pattern("[1-9][0-9]{1,30}")])],
      maxPatients: ['', Validators.compose([Validators.required,Validators.pattern("[1-9][0-9]{1,30}")])],
      pricePerPatient: ['', Validators.compose([Validators.required,Validators.pattern("[1-9][0-9]{1,30}")])],
      pricePerDevice: ['', Validators.compose([Validators.required,Validators.pattern("[1-9][0-9]{1,30}")])],
      durationInMonth: ['', Validators.compose([Validators.required,Validators.pattern("[1-9][0-9]{1,30}")])],
      durationInDays: ['', Validators.compose([Validators.required],Validators.pattern("[1-9][0-9]{1,30}"))]
    });

    this.error = '';

  }

  onSubmit() {
    if (!this.packageForm.valid) {
      console.log(this.packageForm);
      showAlert("Invalid data supplied.", "danger");
      return;
    }

    // insert new page
    if (!this.packageId) {
      let packageData = {
        title: this.packageForm.value.title,
        code: this.packageForm.value.code,
        summary: this.packageForm.value.summary,
        maxDevices: this.packageForm.value.maxDevices,
        maxPatients: this.packageForm.value.maxPatients,
        pricePerPatient: this.packageForm.value.pricePerPatient,
        pricePerDevice: this.packageForm.value.pricePerDevice,
        durationInMonth: this.packageForm.value.durationInMonth,
        durationInDays:this.packageForm.value.durationInDays,
        ownerId: Meteor.userId(),
        active: true,
        deleted: false
      };
      this.call("packages.insert", packageData, (err, res) => {
        if (err) {
          this.zone.run(() => {
            this.error = err;
          });
        } else {
          //console.log("new user-id:", res);
          showAlert("New package saved successfully.", "success");
          this.zone.run(() => {
            this.router.navigate(['/package/list']);
          });
        }
      });
    }
    // finish insert new page
    // update package data
    else {
      let packageData = {
        title: this.packageForm.value.title,
        code: this.packageForm.value.code,
        summary: this.packageForm.value.summary,
        maxDevices: this.packageForm.value.maxDevices,
        maxPatients: this.packageForm.value.maxPatients,
        pricePerPatient:this.packageForm.value.pricePerPatient,
        pricePerDevice:this.packageForm.value.pricePerDevice,
        durationInMonth: this.packageForm.value.durationInMonth,
        durationInDays:this.packageForm.value.durationInDays,
      }
      this.call("packages.update", this.packageId, packageData, (err, res) => {
        if (err) {
          this.zone.run(() => {
            this.error = err;
          });
        } else {
          //console.log("new user-id:", res);
          showAlert("Package data updated successfully.", "success");
          this.zone.run(() => {
            this.router.navigate(['/package/list']);
          });
        }
      });
    }
    // finish update package data
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
  }
}
