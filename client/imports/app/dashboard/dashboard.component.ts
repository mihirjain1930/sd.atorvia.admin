import { Component, OnInit } from "@angular/core";
import { MeteorComponent } from 'angular2-meteor';
import { Meteor } from "meteor/meteor";

import template from "./dashboard.html";

@Component({
    selector: "dashboard",
    template
})

export class DashboardComponent extends MeteorComponent implements OnInit {
    usersActive: number;
    usersInactive: number;
    packagesActive: number;
    totalUsers: number;

    constructor() {
        super();
    }

    ngOnInit() {
        this.fetchStats();
    }

    private fetchStats() {
        this.call("fetchStats", (err, res) => {
            if (err) {
                console.log(err)
                return;
            }
            this.usersActive = res.users.active;
            this.usersInactive = res.users.inactive;
            this.packagesActive = res.packages.active;
            this.totalUsers = (res.users.active) + (res.users.inactive)
        });
    }
}