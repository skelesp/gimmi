import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookShareButtonComponent } from './facebook-share-button.component';

describe('FacebookShareButtonComponent', () => {
  let component: FacebookShareButtonComponent;
  let fixture: ComponentFixture<FacebookShareButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookShareButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookShareButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
