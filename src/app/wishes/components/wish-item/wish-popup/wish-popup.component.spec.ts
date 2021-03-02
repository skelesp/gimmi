import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishPopupComponent } from './wish-popup.component';

describe('WishPopupComponent', () => {
  let component: WishPopupComponent;
  let fixture: ComponentFixture<WishPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
