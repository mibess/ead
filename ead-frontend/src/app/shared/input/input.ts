import { Component, computed, input } from '@angular/core';

type InputSize = 'sm' | 'md' | 'lg';
type InputState = 'default' | 'error' | 'success';

@Component({
  selector: 'input[app-input]',
  standalone: true,
  template: '',
  host: {
    '[class]': 'inputClasses()'
  }
})
export class Input {
  size = input<InputSize>('md');
  state = input<InputState>('default');

  inputClasses = computed(() => {
    const size = this.size();
    const state = this.state();

    const base = [
      'w-full rounded-2xl text-white bg-white/5 px-4 py-4 text-[15px] placeholder:text-slate-400 outline-none ring-1 ring-white/10 focus:ring-2 transition'
    ];

    const sizeMap: { [key in InputSize]: string } = {
      sm: 'px-3 py-2 text-sm',
      md: 'p-3 text-base',
      lg: 'px-4 py-4 text-lg'
    };

    const stateMap: { [key in InputState]: string } = {
      default: '',
      error: 'focus:ring-red-500',
      success: 'focus:ring-green-500'
    };

    return [
      ...base,
      sizeMap[size],
      stateMap[state]
    ].join(' ');
  });
}
