import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeanStartupComponent } from './lean-startup.component';

describe('LeanStartupComponent', () => {
  let component: LeanStartupComponent;
  let fixture: ComponentFixture<LeanStartupComponent>;

  beforeEach(async(() => {
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
