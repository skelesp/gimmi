import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WishCreateCardComponent } from './wish-create-card.component';

describe('WishCreateComponent', () => {
  let component: WishCreateCardComponent;
  let fixture: ComponentFixture<WishCreateCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WishCreateCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishCreateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
