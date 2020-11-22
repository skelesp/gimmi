import { Component, Input, OnInit } from '@angular/core';
import { ILike } from '../../models/person.model';
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'gimmi-extra-info',
  templateUrl: './extra-info.component.html',
  styleUrls: ['./extra-info.component.css']
})
export class ExtraInfoComponent implements OnInit {
  @Input() firstName : string;
  @Input() likes: ILike[] = [];
  @Input() dislikes: ILike[] = [];
  @Input() personIsUser: boolean = false;  

  editMode: boolean = false;
  pencilIcon = faPencilAlt;

  constructor( ) { }

  ngOnInit(): void { }

}
