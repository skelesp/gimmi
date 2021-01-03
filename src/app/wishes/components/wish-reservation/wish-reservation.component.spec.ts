import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishReservationComponent } from './wish-reservation.component';

describe('WishReservationComponent', () => {
  let component: WishReservationComponent;
  let fixture: ComponentFixture<WishReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
