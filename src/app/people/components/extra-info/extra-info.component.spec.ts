import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExtraInfoComponent } from './extra-info.component';

describe('ExtraInfoComponent', () => {
  let component: ExtraInfoComponent;
  let fixture: ComponentFixture<ExtraInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
