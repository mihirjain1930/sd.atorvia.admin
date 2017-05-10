import { Component, OnInit } from "@angular/core";
import { MeteorComponent } from 'angular2-meteor';
import { Meteor } from "meteor/meteor";

import template from "./dashboard.html";

@Component({
    selector: "dashboard",
    template
})

export class DashboardComponent extends MeteorComponent implements OnInit {
  totalStats: any;

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

            this.totalStats = res;
        });


    }
}
