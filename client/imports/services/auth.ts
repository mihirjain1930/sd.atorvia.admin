import { Meteor } from 'meteor/meteor';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import {Observable} from "rxjs";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Roles } from 'meteor/alanning:roles';
import {showAlert} from "../app/shared/show-alert";
import { UserService } from './user';

@Injectable()
export class AuthService implements CanActivate {
  constructor(private user: UserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    let roles = route.data["roles"] as Array<string>;

    if (! Roles.userIsInRole(Meteor.userId(), roles) ) {
      showAlert("You are not authorized to access this page.", "danger");
      return false;
    }

    return true;
  }
}