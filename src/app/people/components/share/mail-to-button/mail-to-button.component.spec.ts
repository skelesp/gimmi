import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MailToButtonComponent } from './mail-to-button.component';

describe('MailToButtonComponent', () => {
  let component: MailToButtonComponent;
  let fixture: ComponentFixture<MailToButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MailToButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailToButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
