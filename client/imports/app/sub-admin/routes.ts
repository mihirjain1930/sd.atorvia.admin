import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { CreateSubadminComponent } from "./create";
import { UpdateSubadminComponent } from "./update";
import { ListSubadminComponent } from "./list";

export const routes = [
    {path: "sub-admin/create", component: CreateSubadminComponent},
    {path: "sub-admin/list", component: ListSubadminComponent},
    {path: "sub-admin/update/:id", component: UpdateSubadminComponent}
];

