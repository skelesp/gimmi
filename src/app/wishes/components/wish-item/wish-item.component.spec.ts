import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WishItemComponent } from './wish-item.component';

describe('WishItemComponent', () => {
  let component: WishItemComponent;
  let fixture: ComponentFixture<WishItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WishItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
