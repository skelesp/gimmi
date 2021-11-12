import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyToClipboardButtonComponent } from './copy-to-clipboard-button.component';

describe('CopyToClipboardButtonComponent', () => {
  let component: CopyToClipboardButtonComponent;
  let fixture: ComponentFixture<CopyToClipboardButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyToClipboardButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyToClipboardButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
