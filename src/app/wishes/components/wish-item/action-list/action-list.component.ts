import { Component, Input } from '@angular/core';
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { ActionListItemConfig } from './action-list-item/action-list-item.component';

@Component({
  selector: 'gimmi-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.css']
})
export class ActionListComponent {
  @Input() actionListItems : ActionListItemConfig[];
  actionListIcon = faEllipsisV;
}
