import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { CreateSubadminComponent } from "./create";

export const routes = [
    {path: "sub-admin/create", component: CreateSubadminComponent}
];

