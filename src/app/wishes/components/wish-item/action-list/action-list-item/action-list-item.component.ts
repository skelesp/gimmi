import { Component, Input, OnInit } from '@angular/core';
import { ActionListConfig } from '../action-list.component';

@Component({
  selector: 'gimmi-action-list-item',
  templateUrl: './action-list-item.component.html',
  styleUrls: ['./action-list-item.component.css']
})
export class ActionListItemComponent implements OnInit {
  @Input() itemConfig: ActionListConfig;

  constructor() { }

  ngOnInit(): void {
  }

}
