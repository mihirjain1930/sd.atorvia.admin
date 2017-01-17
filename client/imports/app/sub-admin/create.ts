import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import { MeteorComponent } from 'angular2-meteor';

import template from "./create.html";

@Component({
  selector: 'create-subadmin',
  template
})
export class CreateSubadminComponent extends MeteorComponent implements OnInit {
  createForm: FormGroup;
  error: string;
  rolesArray: [{label: string, value: string}] = [
    {label: "Sub-admin", value: "sub-admin"},
    {label: "Moderator", value: "moderator"}
    ];
  rolesBoxArray: FormArray;

  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {
    super();

    this.rolesBoxArray = new FormArray( [], this.rolesRequired );
    for( let r in this.rolesArray ) {
      this.rolesBoxArray.push( new FormControl() )
    }
  }

  ngOnInit() {
    var emailRegex = "[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})";
    this.createForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.pattern(emailRegex), Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern("[a-zA-Z\.]{2,}[a-zA-Z ]{0,30}")])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern("[a-zA-Z\.]{2,}[a-zA-Z ]{0,30}")])],
      phoneNum: ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.maxLength(15)])],
      roles: this.rolesBoxArray
    });

    this.error = '';
  }

  rolesRequired(formArray: FormArray) {
    let valid = false;
      for( let c in formArray.controls ) {
        if( formArray.controls[c].value == true ) { valid = true }
      }
      return valid == true ? null : { required: true }
  }

  onSubmit() {
    let roles = [];
    for (let i=0; i<this.createForm.value.roles.length; i++) {
      if (this.createForm.value.roles[i] === true) {
        roles.push(this.rolesArray[i].value);
      }
    }

    if (this.createForm.valid) {
      let userData = {
        email: this.createForm.value.email,
        passwd: this.createForm.value.password,
        profile: {
          firstName: this.createForm.value.firstName,
          lastName: this.createForm.value.lastName,
          phoneNum: this.createForm.value.phoneNum
        }
      };
      this.call("users.insert", userData, roles, (err, res) => {
        if (err) {
          this.zone.run(() => {
            this.error = err;
          });
        } else {
          console.log("new user-id:", res);
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }
}