import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { BehaviorSubject, first, Observable, switchMap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Injectable()
export class HttpContextInterceptor implements HttpInterceptor {
  private regionSubject = new BehaviorSubject<string | null>(null);
  private languages: string[];
  private timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone; // Default to browser timezone

  constructor(private authService: AuthService) {
    this.languages = this.getLanguages();
    this.fetchRegion();
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.regionSubject.pipe(
      first((region) => region !== null), // Wait until region is set
      switchMap((region) => {
        let headers = req.headers
          .set('X-Region', region as string) // Safe because `first()` ensures it's not null
          .set('X-Timezone', this.timezone)
          .set('X-Languages', this.languages!.join(','));

        // If authenticated, override region from user metadata
        this.authService.user$.subscribe((user) => {
          if (user && user['region']) {
            headers = headers.set('X-Region', user['region']);
          }
          if (user && user['languages']) {
            headers = headers.set('X-Languages', user['languages'].join(','));
          }
        });

        const modifiedReq = req.clone({ headers });
        return next.handle(modifiedReq);
      })
    );
  }

  private fetchRegion(): void {
    fetch('https://ipapi.co/json/')
      .then((response) => response.json())
      .then((data) => {
        this.regionSubject.next(data.country_code || 'US'); // Set region once fetched
      })
      .catch(() => {
        this.regionSubject.next('US'); // Fallback
      });
  }

  private getLanguages(): string[] {
    return Array.from(
      new Set(
        Array.from(navigator.languages || [navigator.language] || ['en']).map(
          (lang) => new Intl.Locale(lang).language
        )
      )
    );
  }
}
