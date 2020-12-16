import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraInfoViewComponent } from './extra-info-view.component';

describe('ExtraInfoViewComponent', () => {
  let component: ExtraInfoViewComponent;
  let fixture: ComponentFixture<ExtraInfoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraInfoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraInfoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
