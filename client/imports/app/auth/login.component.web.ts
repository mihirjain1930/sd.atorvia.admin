import {Component, OnInit, NgZone} from '@angular/core';
import { MeteorComponent } from 'angular2-meteor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import {FacebookService, FacebookLoginOptions, FacebookLoginResponse, FacebookInitParams} from 'ng2-facebook-sdk';
import {validateEmail, validatePhoneNum, validateFirstName} from "../../validators/common";

import template from './login.component.web.html';

@Component({
  selector: 'login',
  template,
  providers: [FacebookService]
})
export class LoginComponent extends MeteorComponent implements OnInit {
    loginForm: FormGroup;
    error: string;

    constructor(private router: Router, private zone: NgZone, private formBuilder: FormBuilder, private fb: FacebookService) {
        super();
        let fbParams: FacebookInitParams = {
                                       appId: '1842716892658116',
                                       xfbml: true,
                                       version: 'v2.6',
                                       cookie: true
                                       };
        this.fb.init(fbParams);
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
          email: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), validateEmail])],
          password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(30)])]
        });

        this.error = '';
    }

    login() {
        if (this.loginForm.valid) {
            Meteor.loginWithPassword(this.loginForm.value.email, this.loginForm.value.password, (err) => {
                if (err) {
                    this.zone.run(() => {
                      this.error = err;
                    });
                } else {
                    this.router.navigate(['/dashboard']);
                }
            });
        }
    }

    fblogin(): void {
      let options: FacebookLoginOptions = {
        enable_profile_selector: true, // allow user to pick what profile to login with
        return_scopes: true, // returns the scopes that the user authorized
        scope: 'public_profile,email' // the scopes we want the user to authorize
      };

      this.fb.login(options).then(
        (response: FacebookLoginResponse) => {
          console.log(response);
          var promise = this.fb.api('/me', 'get', { fields: 'email, first_name, last_name' });
          promise.then((res)=> {
              console.log(res);
            });
          },
        (error: any) => console.error(error)
      );
    }
}
