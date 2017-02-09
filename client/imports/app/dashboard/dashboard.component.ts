import { Component, OnInit } from "@angular/core";
import { Meteor } from "meteor/meteor";

import template from "./dashboard.html";

@Component({
    selector: "dashboard",
    template
})

export class DashboardComponent implements OnInit {
usersActive:String;
usersInactive:String;
packagesActive:String;
totalUsers:String;

    constructor() {
    }

    ngOnInit() {
        Meteor.call("fetchStats",(err,res)=>{
    if(!err){
      this.usersActive=res.users.active;
      this.usersInactive=res.users.inactive;
      this.packagesActive=res.packages.active;
      this.totalUsers=(res.users.active)+(res.users.inactive)   
    }
    else
    {
      console.log(err)
    }
  });
    }
}