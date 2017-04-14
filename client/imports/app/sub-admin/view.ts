import { Meteor } from "meteor/meteor";
import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import { Subscription } from "rxjs";
import { User } from "../../../../both/models/user.model";
import {showAlert} from "../shared/show-alert";

import template from "./view.html";

@Component({
  selector: '',
  template
})
export class ViewSubadminComponent extends MeteorComponent implements OnInit {
  paramsSub: Subscription;
  userId: string;
  user: User;
  error: string;
  constructor(private router: Router, private route: ActivatedRoute, private zone: NgZone) {
    super();
  }

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['id'])
      .subscribe(id => {
          this.userId = id;
          //console.log("patientId:", patientId);

          this.call("users.findOne", id, (err, res)=> {
              if (err || typeof res == "undefined" || res._id !== id) {
                  //console.log("error while fetching patient data:", err);
                  showAlert("Error while fetching user data.", "danger");
                  this.zone.run(() => {
                    this.router.navigate(['/sub-admin/list']);
                  });
                  return;
              }
              this.user = res;
          });
      });

    this.error = '';
  }


  verifyCertificate (user: User) {
    if (! confirm("Are you sure to verify the supplier's certificate?")) {
        return false;
    }

    this.call("verifyAgentCertificate", this.userId, (err, res) => {
      if (! err) {
        showAlert("Agent Certificate has been verified successfully.", "success");

        user.profile.agentCertificate.verified = true;
      } else {
        showAlert("Error verifying agent certificate.", "danger");
      }
    })
  }

  unverifyCertificate (user: User) {
    if (! confirm("Are you sure to unverify the supplier's certificate?")) {
        return false;
    }

    this.call("unverifyAgentCertificate", this.userId, (err, res) => {
      if (! err) {
        showAlert("Agent Certificate has been unverified successfully.", "success");

        user.profile.agentCertificate.verified = false;
      } else {
        console.log(err);
        showAlert("Error verifying agent certificate.", "danger");
      }
    })
  }

  verifyIdentity(user: User) {
    if (! confirm("Are you sure to verify the supplier's identity?")) {
      return false;
    }

    this.call("verifyAgentIdentity", this.userId, (err, res) => {
      if (! err) {
        showAlert("Agent Certificate has been verified successfully.", "success");

        user.profile.agentIdentity.verified = true;
      } else {
        showAlert("Error verifying agent certificate.", "danger");
      }
    })
  }

  unverifyIdentity(user: User) {
    if (! confirm("Are you sure to unverify the supplier's identity?")) {
      return false;
    }

    this.call("unverifyAgentIdentity", this.userId, (err, res) => {
      if (! err) {
        showAlert("Agent Certificate has been unverified successfully.", "success");

        user.profile.agentIdentity.verified = false;
      } else {
        console.log(err);
        showAlert("Error verifying agent certificate.", "danger");
      }
    })
  }
}
