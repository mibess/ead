import { Directive, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneMask]',
  standalone: true
})
export class PhoneMaskDirective implements OnInit {
  private el = inject(ElementRef);
  private ngControl = inject(NgControl, { optional: true });

  ngOnInit(): void {
    // Format initial value if present
    setTimeout(() => {
      const input = this.el.nativeElement as HTMLInputElement;
      if (input.value) {
        const formatted = this.formatPhone(input.value);
        input.value = formatted;
        if (this.ngControl?.control) {
          this.ngControl.control.setValue(formatted, { emitEvent: false });
        }
      }
    }, 0);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const input = this.el.nativeElement as HTMLInputElement;
    const { selectionStart, selectionEnd, value } = input;

    if (event.key === 'Backspace' && selectionStart === selectionEnd && selectionStart !== null) {
      const charBefore = value[selectionStart - 1];
      // If deleting a formatting char, manually shift cursor to the left of it
      if (charBefore === ')' || charBefore === ' ' || charBefore === '-') {
        let pos = selectionStart - 1;
        while (pos > 0 && /\D/.test(value[pos - 1])) {
          pos--;
        }
        input.setSelectionRange(pos, pos);
      }
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    const input = this.el.nativeElement as HTMLInputElement;
    let value = input.value;

    // Clean only non-digits
    const digits = value.replace(/\D/g, '');
    const formatted = this.formatPhone(digits);

    // Get cursor position
    let cursorPosition = input.selectionStart || 0;
    const oldLength = value.length;

    input.value = formatted;

    // Update the Form Control
    if (this.ngControl?.control) {
      this.ngControl.control.setValue(formatted, { emitEvent: false });
    }

    // Adjust cursor position
    const newLength = formatted.length;
    const lengthDifference = newLength - oldLength;

    if (lengthDifference !== 0) {
      cursorPosition += lengthDifference;
    }

    // Ensure cursor is not placed on a formatting character when moving
    if (lengthDifference > 0 && (formatted[cursorPosition - 1] === ')' || formatted[cursorPosition - 1] === '-' || formatted[cursorPosition - 1] === ' ')) {
      cursorPosition++;
    }

    input.setSelectionRange(cursorPosition, cursorPosition);
  }

  private formatPhone(value: string): string {
    if (!value) return '';

    // Strip all non-digits
    let digits = value.replace(/\D/g, '');

    // Limit to 11 digits
    if (digits.length > 11) {
      digits = digits.slice(0, 11);
    }

    if (digits.length === 0) {
      return '';
    }

    if (digits.length <= 2) {
      return `(${digits}`;
    }

    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
}
