import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, tap, filter } from "rxjs/operators";
import { faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { IPerson } from '../models/person.model';
import { PeopleService } from '../service/people.service';

@Component({
  selector: 'gimmi-people-search',
  templateUrl: './people-search.component.html',
  styleUrls: ['./people-search.component.css']
})
export class PeopleSearchComponent implements OnInit {
  userIcon = faUserCircle;
  searchIcon = faSearch;
  people: IPerson[] = [];
  selectedPerson: IPerson;

  constructor( private peopleService : PeopleService, private router : Router) { }

  ngOnInit(): void {
    this.peopleService.retrievePeopleList().subscribe( people => {
      this.people = people; 
    });
  }

  search = (text$: Observable<string>) : Observable<IPerson[]> => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? [] : this.people
                                            .filter(person => person.fullName.toLowerCase().indexOf(term.toLowerCase()) > -1)
                                            .slice(0, 10)
      )
    );
  }

  inputFormatter (person: IPerson) {
    return `${person.fullName}`;
  }

  resultFormatter (person: IPerson) {
    return `${person.fullName} (${person.id})`;
  }

  onPersonSelect($event) {
    $event.preventDefault();
    this.router.navigate(['/people', $event.item.id]);
    this.selectedPerson = null;
  }

}