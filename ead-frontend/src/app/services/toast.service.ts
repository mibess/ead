import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public currentToast = signal<ToastMessage | null>(null);
  private timeoutId: any;

  showSuccess(message: string) {
    this.show(message, 'success');
  }

  showError(message: string) {
    this.show(message, 'error');
  }

  showInfo(message: string) {
    this.show(message, 'info');
  }

  private show(message: string, type: ToastType) {
    this.currentToast.set({ message, type });
    
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = setTimeout(() => {
      this.currentToast.set(null);
    }, 5000); // Auto hide after 5 seconds
  }

  hide() {
    this.currentToast.set(null);
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
