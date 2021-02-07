import { Component, Input, OnInit } from '@angular/core';
import { faEllipsisV, IconDefinition } from "@fortawesome/free-solid-svg-icons";

export interface ActionListConfig {
  text: string;
  icon: IconDefinition;
  onClick?: () => void;
  url?: string;
}

@Component({
  selector: 'gimmi-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.css']
})
export class ActionListComponent implements OnInit {
  @Input() actionListItems : ActionListConfig[];
  actionListIcon = faEllipsisV;

  constructor() { }

  ngOnInit(): void {
  }

}
