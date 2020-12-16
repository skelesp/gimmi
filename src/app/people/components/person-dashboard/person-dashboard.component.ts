import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/users/models/user.model';
import { UserService } from 'src/app/users/service/user.service';
import { IExtraPersonInfo, Person } from '../../models/person.model';

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
      this.person = data.person;
    });
  }

  updateExtraInfo(extraInfo: IExtraPersonInfo) {
    this.person.extraInfo.likes = extraInfo.likes;
    this.person.extraInfo.dislikes = extraInfo.dislikes;
  }

}
