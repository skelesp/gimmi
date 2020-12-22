import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishBannerComponent } from './wish-banner.component';

describe('WishBannerComponent', () => {
  let component: WishBannerComponent;
  let fixture: ComponentFixture<WishBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
