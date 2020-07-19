import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, tap } from "rxjs/operators";
import { faMale, faFemale, faUserCircle } from "@fortawesome/free-solid-svg-icons";

const people = [
  { name: "Stijn", age: "35", sex: "m", pic: 'https://avatars3.githubusercontent.com/u/17392369?s=400&v=4' },
  { name: "Chloé", age: "32", sex: "v" },
  { name: "Herman", age: "42", sex: "m" },
  { name: "Katrien", age: "60", sex: "v" },
  { name: "Kathleen", age: "50", sex: "v" },
  { name: "Katleen", age: "42", sex: "v" },
  { name: "Kato", age: "30", sex: "v" },
  { name: "Katrijn", age: "25", sex: "v" }
];

@Component({
  selector: 'gimmi-people-search',
  templateUrl: './people-search.component.html',
  styleUrls: ['./people-search.component.css']
})
export class PeopleSearchComponent implements OnInit {
  person: any;
  userIcon = faUserCircle;

  constructor() { }

  ngOnInit(): void {
  }

  search (text$: Observable<string>) {
    return text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap((term) => console.log(`search for ${term}`)),
      map(term => term === '' ? [] : people
                                            .filter(person => person.name.toLowerCase().indexOf(term.toLowerCase()) > -1)
                                            .slice(0, 10)
            )
    );
  }

  inputFormatter (person) {
    return `${person.name}`;
  }

  resultFormatter (person) {
    return `${person.name} (${person.sex}, ${person.age})`;
  }

  onPersonSelect(eventPayload) {
    console.log(eventPayload.item);
  }

}
