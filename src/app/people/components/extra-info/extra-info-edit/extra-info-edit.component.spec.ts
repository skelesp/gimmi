import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraInfoEditComponent } from './extra-info-edit.component';

describe('ExtraInfoEditComponent', () => {
  let component: ExtraInfoEditComponent;
  let fixture: ComponentFixture<ExtraInfoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtraInfoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraInfoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
