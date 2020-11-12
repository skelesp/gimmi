import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDashboardComponent } from './person-dashboard.component';

describe('PersonDashboardComponent', () => {
  let component: PersonDashboardComponent;
  let fixture: ComponentFixture<PersonDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
