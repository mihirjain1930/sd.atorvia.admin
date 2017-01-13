import {Component, OnInit, NgZone} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Accounts } from 'meteor/accounts-base';
import {MeteorComponent} from 'angular2-meteor';

import template from './signup.component.html';

@Component({
  selector: 'signup',
  template
})
export class SignupComponent extends MeteorComponent implements OnInit {
  signupForm: FormGroup;
  error: string;

  constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder) {
    super();
  }

    ngOnInit() {
        var emailRegex = "[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})";
        this.signupForm = this.formBuilder.group({
          email: ['', Validators.compose([Validators.pattern(emailRegex), Validators.required])],
          password: ['', Validators.compose([Validators.required, Validators.minLength(6)]) ],
          firstName: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z ]{2,30}")])],
          lastName: ['', Validators.compose([Validators.required, Validators.pattern("[a-zA-Z ]{2,30}")])],
        });
  
        this.error = '';
    }

    signup() {
        if (this.signupForm.valid) {
          let userData = {
            email: this.signupForm.value.email,
            passwd: this.signupForm.value.password,
            profile: {
              firstName: this.signupForm.value.firstName,
              lastName: this.signupForm.value.lastName
            }
          };
          this.call("users.insert", userData, (err, res) => {
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