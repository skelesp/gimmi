import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, tap } from "rxjs/operators";
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

  constructor( private peopleService : PeopleService) { }

  ngOnInit(): void {
    this.peopleService.getPeople().subscribe( people => {
      this.people = people; 
      console.log('result of observable', people);
    });
  }

  search = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap((term) => console.log(`search for ${term}`)),
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

  onPersonSelect(eventPayload) {
    console.log(eventPayload.item);
  }

}
