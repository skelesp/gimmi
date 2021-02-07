import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionListItemComponent } from './action-list-item.component';

describe('ActionListItemComponent', () => {
  let component: ActionListItemComponent;
  let fixture: ComponentFixture<ActionListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
