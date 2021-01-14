import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeWishReservationComponent } from './change-wish-reservation.component';

describe('ChangeWishReservationComponent', () => {
  let component: ChangeWishReservationComponent;
  let fixture: ComponentFixture<ChangeWishReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeWishReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeWishReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
