import { Meteor } from "meteor/meteor";
import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MeteorComponent } from 'angular2-meteor';
import { Observable, Subscription, Subject, BehaviorSubject } from "rxjs";
import {PaginationService} from "ng2-pagination";
import { ChangeDetectorRef } from "@angular/core";
import { LocalStorageService } from 'angular-2-local-storage';
import { User } from "../../../../both/models/user.model";
import { Patient } from "../../../../both/models/patient.model";
import {showAlert} from "../shared/show-alert";

import template from "./view.html";

interface Pagination {
  limit: number;
  skip: number;
}

interface Options extends Pagination {
  [key: string]: any
}

@Component({
  selector: '',
  template
})
export class ViewPractitionerComponent extends MeteorComponent implements OnInit {
  paramsSub: Subscription;
  userId: string;
  user: User;
  patients: Patient[];
  error: string;
  pageSize: Subject<number> = new Subject<number>();
  curPage: Subject<number> = new Subject<number>();
  nameOrder: Subject<number> = new Subject<number>();
  optionsSub: Subscription;
  itemsSize: number = -1;
  searchSubject: Subject<string> = new Subject<string>();
  searchString: string = "";

  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private paginationService: PaginationService,
    private localStorageService: LocalStorageService
  ) {
    super();
  }

  ngOnInit() {
    this.paramsSub = this.route.params
      .map(params => params['id'])
      .subscribe(id => {
          this.userId = id;
          //console.log("patientId:", patientId);
          
          this.findUser();
      });

    this.error = '';
  }

  search(value: string): void {
      this.searchSubject.next(value);
  }
  
  onPageChanged(page: number): void {
      this.curPage.next(page);
  }

  get patientArr() {
    //console.log("inside get patientArr");
    return this.patients;
  }

  private findUser() {
    this.call("users.findOne", this.userId, (err, res)=> {
        if (err || typeof res == "undefined" || res._id !== this.userId) {
            //console.log("error while fetching patient data:", err);
            showAlert("Error while fetching user data.", "danger");
            this.zone.run(() => {
              this.router.navigate(['/practitioner/list']);
            });
            return;
        }
        this.user = res;
        this.findPatients();
    });
  }

  private findPatients() {
    this.optionsSub = Observable.combineLatest(
        this.pageSize,
        this.curPage,
        this.nameOrder,
        this.searchSubject
    ).subscribe(([pageSize, curPage, nameOrder, searchString]) => {
        const options: Options = {
            limit: pageSize as number,
            skip: ((curPage as number) - 1) * (pageSize as number),
            sort: { "firstName": nameOrder as number },
            fields: {firstName: 1, lastName: 1, email: 1, phonenumber: 1, gender: 1, dob: 1, address: 1, city: 1, pincode: 1}
        };
        /*this.localStorageService.set("patient-list.options", {
            pageSize: pageSize,
            curPage: curPage,
            nameOrder: nameOrder,
            searchString: searchString
        });*/

        this.paginationService.setCurrentPage(this.paginationService.defaultId, curPage as number);

        //console.log("options:", options);
        //console.log("searchString:", this.searchString);
        this.searchString = searchString;
        jQuery(".loading").show();
        this.call("patients.find", options, {practitioner: this.userId}, searchString, (err, res) => {
            //console.log("patients.find() done");
            jQuery(".loading").hide();
            if (err) {
                //console.log("error while fetching patient list:", err);
                showAlert("Error while fetching patients list.", "danger");
                return;
            }
            this.patients = res.data;
            this.itemsSize = res.count;
            this.paginationService.setTotalItems(this.paginationService.defaultId, this.itemsSize);

            setTimeout(function(){
                jQuery(function($){
                /*$('.tooltipped').tooltip({delay: 0});*/
                });
            }, 200);
        })

    });

    //let options:any = this.localStorageService.get("patient-list.options");
    //console.log("patient-list.options:", options);

    let options = {
        limit: 10,
        curPage: 1,
        nameOrder: 1,
        searchString: '',
    };

    this.paginationService.register({
    id: this.paginationService.defaultId,
    itemsPerPage: 10,
    currentPage: options.curPage,
    totalItems: this.itemsSize
    });

    this.pageSize.next(options.limit);
    this.curPage.next(options.curPage);
    this.nameOrder.next(options.nameOrder);
    this.searchSubject.next(options.searchString);
  }
}