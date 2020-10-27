import { ChangeDetectorRef, Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[bindQueryParamToInput]'
})
export class BindQueryparamToInputDirective {
  @Input('bindQueryParamToInput') paramKey: string;

  constructor( 
    private ngControl : NgControl,
    private ref : ChangeDetectorRef
    ) { }

  ngOnInit() {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.has(this.paramKey)) {
      this.ngControl.control.patchValue(queryParams.get(this.paramKey));
      this.ref.detectChanges(); // Prevent "Expression has changed after it was checked. Previous value: 'null'. Current value: 'testuser@test.be'"
    }
  }

}