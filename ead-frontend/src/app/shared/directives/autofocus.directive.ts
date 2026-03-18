import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
  standalone: true
})
export class AutofocusDirective implements AfterViewInit {
  private el = inject(ElementRef);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.el.nativeElement.focus();
    }, 50); // Small timeout to ensure Angular has fully rendered and inserted the element.
  }
}
