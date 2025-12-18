import { Component, computed, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

type ButtonColor = 'primary' | 'secondary' | 'danger' | 'light' | 'dark' | 'middle';
type ButtonVariant = 'solid' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonIconPosition = 'start' | 'end';

@Component({
  selector: 'button[app-button], a[app-button]',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  host: {
    '[class]': 'buttonClasses()',
    '[attr.disabled]': "loading() ? true : null"
  }
})
export class ButtonComponent {
  color = input<ButtonColor>('primary');
  variant = input<ButtonVariant>('solid');
  size = input<ButtonSize>('md');
  loading = input<boolean>(false);
  icon = input<string | null>(null);
  iconPosition = input<ButtonIconPosition>('start');

  buttonClasses = computed(() => {
    const color = this.color();
    const variant = this.variant();
    const size = this.size();

    const base = [
      'w-full flex items-center justify-center py-3.5 px-8 rounded-2xl',
      'font-semibold',
      'hover:scale-[1.02] active:scale-[0.98] transition-all duration-200',
      'disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer'
    ];

    const sizeMap = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-base',
      lg: 'px-6 py-4 text-lg'
    };

    const variantMap: Record<ButtonVariant, Record<ButtonColor, string>> = {
      solid: {
        primary: 'border-1 border-indigo-600 bg-indigo-600 hover:bg-indigo-500 text-white active:bg-indigo-700 focus:ring-indigo-500',
        secondary: 'border-1 border-emerald-600 bg-emerald-600 hover:bg-emerald-500 text-white active:bg-emerald-700 focus:ring-emerald-500',
        danger: 'border-1 border-red-600 bg-red-600 hover:bg-red-500 text-white active:bg-red-700 focus:ring-red-500',
        light: 'border-1 border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-900 active:bg-slate-300 focus:ring-slate-400',
        dark: 'border-1 border-slate-900 bg-slate-900 hover:bg-slate-800 text-white active:bg-slate-900 focus:ring-slate-800',
        middle: 'border-1 border-slate-600 bg-slate-600 hover:bg-slate-500 text-white active:bg-slate-600 focus:ring-slate-500'
      },
      outline: {
        primary: 'border-1 border-indigo-600 text-indigo-600 hover:bg-indigo-500/10 active:bg-indigo-500/20 focus:ring-indigo-500',
        secondary: 'border-1 border-emerald-600 text-emerald-600 hover:bg-emerald-500/10 active:bg-emerald-500/20 focus:ring-emerald-500',
        danger: 'border-1 border-red-600 text-red-600 hover:bg-red-500/10 active:bg-red-500/20 focus:ring-red-500',
        light: 'border-1 border-slate-200 text-slate-200 hover:bg-slate-500/10 active:bg-slate-500/20 focus:ring-slate-200',
        dark: 'border-1 border-slate-900 text-slate-900 hover:bg-slate-500/10 active:bg-slate-500/20 focus:ring-slate-900',
        middle: 'border-1 border-slate-500 text-slate-500 hover:bg-slate-500/10 active:bg-slate-500/20 focus:ring-slate-500'
      }
    };

    return [
      ...base,
      sizeMap[size],
      variantMap[variant][color]
    ].join(' ');
  });

}
