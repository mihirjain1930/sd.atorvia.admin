import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';
import { AuthService } from "../../services/auth";

import { CreatePackageComponent } from "./packagecreate";
import { ListPackageComponent } from "./packagelist";
import { ViewPackageComponent } from "./packageview";


export const routes = [
    { path: "package/create", component: CreatePackageComponent, canActivate: [AuthService], data: {'roles': ['super-admin']} },
    { path: "package/list", component: ListPackageComponent, canActivate: [AuthService], data: {'roles': ['super-admin']} },
    { path: "package/update/:id", component: CreatePackageComponent, canActivate: [AuthService], data: {'roles': ['super-admin']} },
    { path: "package/view/:id", component: ViewPackageComponent, canActivate: [AuthService], data: {'roles': ['super-admin']}}
];
