import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, take } from 'rxjs/operators';
import { AuthService, User } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User as UserModel } from '../models/user';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RatingsOnboardingComponent } from '../ratings/ratings-onboarding/ratings-onboarding.component';
import { MoviesService } from '../services/movies.service';
import { LoadingService } from '../services/loading.service';
import { TrackLoading } from '../decorators/track-loading.decorator';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  creatingNew = false;
  isNavExpanded = false;
  user: User | undefined | null;
  search: string = '';

  ref: DynamicDialogRef | undefined;

  constructor(
    public authService: AuthService,
    public router: Router,
    private userService: UserService,
    public dialogService: DialogService,
    private moviesService: MoviesService,
    public loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.loadUser$()
      .pipe(take(1))
      .subscribe((response: any) => {
        this.user = response;
        if (this.user) {
          if (!this.user['_id']) {
            this.userService
              .createUser()
              .pipe(take(1))
              .subscribe({
                next: (response: UserModel) => this.show(response),
                error: (err) => console.error('Error creating user:', err),
              });
          } else if (!this.user['onboarding_completed']) {
            this.show();
          } else {
            this.moviesService.createRecommendation().subscribe({
              next: () => {
                console.log('Recommendation created successfully');
              },
              error: (err) => {
                console.error('Error toggling watch:', err);
              },
            });
          }
        }
      });
  }

  login() {
    this.authService.loginWithRedirect({
      appState: { target: this.router.url },
    });
  }

  logout() {
    this.authService.logout({
      logoutParams: { returnTo: window.location.origin },
    });
  }

  setIsNavExpanded(newValue: boolean) {
    this.isNavExpanded = newValue;
  }

  onSearch() {
    if (this.search.trim()) {
      this.router.navigate(['/movies'], {
        queryParams: { search: this.search },
      });
    }
  }

  showSearchBar(): boolean {
    const currentUrl = this.router.url;
    return !currentUrl.startsWith('/movies');
  }

  private refresh(): void {
    window.location.reload();
  }

  show(response: UserModel | null = null): void {
    this.ref = this.dialogService.open(RatingsOnboardingComponent, {
      data: {
        user: response,
      },
      header: 'Rate Movies',
      width: '100%',
      height: '100%',
      resizable: false,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      draggable: false,
      closable: false,
      closeOnEscape: false,
    });

    this.ref.onClose.subscribe(() => {
      this.refresh();
    });
  }

  @TrackLoading()
  loadUser$(): Observable<User | null | undefined> {
    return this.authService.user$;
  }
}
