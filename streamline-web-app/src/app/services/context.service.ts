import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ContextService {
  getContext(): string {
    return 'TEST';
  }
}
