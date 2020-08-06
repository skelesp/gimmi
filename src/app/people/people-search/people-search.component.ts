import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterEvent } from '@angular/router';
import { Observable, Subject, merge, Subscription } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, tap, filter, catchError } from "rxjs/operators";
import { faSearch, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { IPerson } from '../models/person.model';
import { PeopleService } from '../service/people.service';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'gimmi-people-search',
  templateUrl: './people-search.component.html',
  styleUrls: ['./people-search.component.css']
})
export class PeopleSearchComponent implements OnInit, OnDestroy {  
  // Ngbtypeahead variables
  @ViewChild('instance', { static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  // Icons variables
  userIcon = faUserCircle;
  searchIcon = faSearch;
  // Peoplelist variables
  people: IPerson[] = [];
  selectedPerson: IPerson;
  private peopleSubscription: Subscription;

  constructor( private peopleService : PeopleService, private router : Router) { }

  ngOnInit(): void {
    this.peopleSubscription = this.peopleService.people.subscribe( people => {
      this.people = people; 
    });
    this.peopleService.retrievePeopleList();
  }

  search = (text$: Observable<string>) : Observable<IPerson[]> => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clickWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()));
    const inputFocused$ = this.focus$;
    
    return merge(debouncedText$, clickWithClosedPopup$, this.focus$).pipe(
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
    const personId = $event.item.id;
    this.router.navigate(['/people', personId]);
    this.selectedPerson = null;
  }

  ngOnDestroy() {
    this.peopleSubscription.unsubscribe();
  }

}