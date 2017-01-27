import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import{ CreatePackageComponent } from "./packagecreate";
import {ListPackageComponent} from "./packagelist"


export const routes = [
{path: "package/create" , component: CreatePackageComponent},
{path:"package/list", component:ListPackageComponent},
{path: "package/update/:id", component: CreatePackageComponent},
];
