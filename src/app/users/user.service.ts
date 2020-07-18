import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

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
  currentUser = new Subject<User>();

  constructor() { }

  register(newUser : User) {
    this.currentUser.next(newUser);
  }


}
