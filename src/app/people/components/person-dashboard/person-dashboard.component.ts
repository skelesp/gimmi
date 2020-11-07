import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { User } from 'src/app/users/models/user.model';
import { UserService } from 'src/app/users/service/user.service';
import { Person } from '../../models/person.model';
import { IPersonNameResponse, PeopleService } from '../../service/people.service';

@Component({
  selector: 'gimmi-person-dashboard',
  templateUrl: './person-dashboard.component.html',
  styleUrls: ['./person-dashboard.component.css']
})
export class PersonDashboardComponent implements OnInit {
  person : Person;
  currrentUser : User;

  constructor(
    private route : ActivatedRoute,
    private peopleService : PeopleService,
    private userService : UserService
  ) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe( (currentUser) => {
      this.currrentUser = currentUser;
    });

    this.route.paramMap
    .pipe(
      switchMap( ( params : Params) => {
        return this.peopleService.getNameById(params.get('personId') );
      })
    )
    .subscribe((person: Person ) => { 
      if (person) this.person = person;
    },
    error => {
      console.error(error);
    });
  }

}
