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
    private userService : UserService,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe( (currentUser) => {
      this.currrentUser = currentUser;
    });

    this.route.data.subscribe( ( data ) => {
        this.person = data.personOnlyName;
      });
  }

}
