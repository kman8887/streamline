import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeLoaders = new Set<string>();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private queues = new Map<string, Set<string>>();
  private loadingSubjects = new Map<string, BehaviorSubject<boolean>>();

  getLoading$(queueName: string): Observable<boolean> {
    if (!this.loadingSubjects.has(queueName)) {
      this.loadingSubjects.set(queueName, new BehaviorSubject(false));
      this.queues.set(queueName, new Set());
    }

    return this.loadingSubjects.get(queueName)!.asObservable();
  }

  setLoading(queueName: string, token: string, isLoading: boolean): void {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, new Set());
      this.loadingSubjects.set(queueName, new BehaviorSubject(false));
    }

    const queue = this.queues.get(queueName)!;

    if (isLoading) {
      queue.add(token);
    } else {
      queue.delete(token);
    }

    const isAnyLoading = queue.size > 0;
    this.loadingSubjects.get(queueName)!.next(isAnyLoading);

    console.log(`Queue "${queueName}" active:`, [...queue]);
  }

  resetQueue(queueName: string): void {
    this.queues.get(queueName)?.clear();
    this.loadingSubjects.get(queueName)?.next(false);
  }

  resetAll() {
    this.activeLoaders.clear();
    this.loadingSubject.next(false);
  }
}
