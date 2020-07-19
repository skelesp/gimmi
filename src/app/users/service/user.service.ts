import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from "rxjs";

export interface User {
  name: string;
  firstName: string;
  loginStrategy: string;
  accounts?: any
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  currentUser = new BehaviorSubject<User>(null);

  constructor() { }

  register(newUser : User) {
    this.currentUser.next(newUser);
  }

  logout() {
    this.currentUser.next(null);
  }

}
