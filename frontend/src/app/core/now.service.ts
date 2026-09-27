import { DestroyRef, Injectable, inject, signal } from '@angular/core';

/** A shared "current time" signal that ticks once a second. */
@Injectable({ providedIn: 'root' })
export class NowService {
  readonly now = signal(new Date());

  constructor() {
    const id = setInterval(() => this.now.set(new Date()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }
}
