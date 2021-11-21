import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UnknownUserMenuComponent } from './unknown-user-menu.component';

describe('UnknownUserMenuComponent', () => {
  let component: UnknownUserMenuComponent;
  let fixture: ComponentFixture<UnknownUserMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnknownUserMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnknownUserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
