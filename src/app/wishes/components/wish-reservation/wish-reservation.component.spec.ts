import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WishReservationComponent } from './wish-reservation.component';

describe('WishReservationComponent', () => {
  let component: WishReservationComponent;
  let fixture: ComponentFixture<WishReservationComponent>;

  beforeEach(waitForAsync(() => {
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
