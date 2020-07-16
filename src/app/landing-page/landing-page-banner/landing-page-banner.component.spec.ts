import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageBannerComponent } from './landing-page-banner.component';

describe('LandingPageBannerComponent', () => {
  let component: LandingPageBannerComponent;
  let fixture: ComponentFixture<LandingPageBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingPageBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
