import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[click], [ngbDropdown]'
})
export class CursorPointerDirective {

  constructor(private el: ElementRef) { }

  @HostBinding('style.cursor') cursor: string = 'pointer';

}
