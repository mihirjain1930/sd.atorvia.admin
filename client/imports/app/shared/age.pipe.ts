import { Pipe, PipeTransform } from '@angular/core';
import { Meteor } from 'meteor/meteor';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {
  transform(birthDate: Date): Number {
    // convert input to date explicitly
    if (typeof birthDate == "string") {
      birthDate = new Date(birthDate);
    }
    // find age
    let today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
    {
        age--;
    }
    return age;
  }
}
