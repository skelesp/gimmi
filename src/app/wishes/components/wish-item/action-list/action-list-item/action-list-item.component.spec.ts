import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActionListItemComponent } from './action-list-item.component';

describe('ActionListItemComponent', () => {
  let component: ActionListItemComponent;
  let fixture: ComponentFixture<ActionListItemComponent>;

  beforeEach(waitForAsync(() => {
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
