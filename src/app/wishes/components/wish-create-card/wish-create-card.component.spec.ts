import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishCreateCardComponent } from './wish-create-card.component';

describe('WishCreateComponent', () => {
  let component: WishCreateCardComponent;
  let fixture: ComponentFixture<WishCreateCardComponent>;

  beforeEach(async(() => {
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
