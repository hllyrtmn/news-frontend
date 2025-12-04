import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCountSignal = signal<number>(0);
  
  // Computed signal for loading state
  isLoading = computed(() => this.loadingCountSignal() > 0);

  // Show loading
  show(): void {
    this.loadingCountSignal.update(count => count + 1);
  }

  // Hide loading
  hide(): void {
    this.loadingCountSignal.update(count => Math.max(0, count - 1));
  }

  // Reset loading state
  reset(): void {
    this.loadingCountSignal.set(0);
  }
}
