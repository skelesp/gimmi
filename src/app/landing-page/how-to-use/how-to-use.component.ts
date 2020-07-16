import { Component, OnInit } from '@angular/core';
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faListAlt, faPaperPlane } from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'gimmi-how-to-use',
  templateUrl: './how-to-use.component.html',
  styleUrls: ['./how-to-use.component.css']
})
export class HowToUseComponent implements OnInit {
  registerIcon = faUserPlus;
  listIcon = faListAlt;
  sendIcon = faPaperPlane;
  
  constructor() { }

  ngOnInit(): void {
  }

}
