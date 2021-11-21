import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WishCallToActionButtonComponent } from './wish-call-to-action-button.component';

describe('WishCallToActionButtonComponent', () => {
  let component: WishCallToActionButtonComponent;
  let fixture: ComponentFixture<WishCallToActionButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WishCallToActionButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishCallToActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
