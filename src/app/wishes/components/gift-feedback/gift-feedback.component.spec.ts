import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftFeedbackComponent } from './gift-feedback.component';

describe('GiftFeedbackComponent', () => {
  let component: GiftFeedbackComponent;
  let fixture: ComponentFixture<GiftFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
