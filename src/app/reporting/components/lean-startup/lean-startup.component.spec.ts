import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeanStartupComponent } from './lean-startup.component';

describe('LeanStartupComponent', () => {
  let component: LeanStartupComponent;
  let fixture: ComponentFixture<LeanStartupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeanStartupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeanStartupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
