import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishDeleteComponent } from './wish-delete.component';

describe('WishDeleteComponent', () => {
  let component: WishDeleteComponent;
  let fixture: ComponentFixture<WishDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
