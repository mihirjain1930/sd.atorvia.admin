import { Route } from '@angular/router';
import { Meteor } from 'meteor/meteor';

import { CreatePageComponent } from "./create";
import { ListPageComponent } from "./list";

export const routes = [
    {path: "page/create", component: CreatePageComponent},
    {path: "page/update/:id", component: CreatePageComponent},
    {path: "page/list", component: ListPageComponent},
];

