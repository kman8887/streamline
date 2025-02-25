import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { isEmpty, map, shareReplay } from 'rxjs/operators';
import { AuthService, User } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

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

  largeNavBarLogo = '/assets/image2vector (1).svg';
  smallNavBarLogo = '/assets/image2vector (1).svg';
  loading = true;
  creatingNew = false;
  isNavExpanded = false;
  user: User | undefined | null;

  constructor(
    public authService: AuthService,
    public router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.authService.appState$.subscribe((response: any) => {
      this.creatingNew = true;
      this.createUserIfNew();
    });

    this.authService.user$.subscribe((response: any) => {
      this.user = response;
      if (this.creatingNew) {
        return;
      }
      this.loading = false;
    });
  }

  login() {
    this.authService.loginWithRedirect({
      appState: { target: this.router.url },
    });
  }

  setIsNavExpanded(newValue: boolean) {
    this.isNavExpanded = newValue;
  }

  private createUserIfNew() {
    if (this.user) {
      if (!this.user['_id']) {
        this.userService.createUser().subscribe((response: any) => {
          this.refresh();
        });
      } else {
        this.loading = false;
      }
    } else {
      this.authService.user$.subscribe((response: User | undefined | null) => {
        if (response != undefined && response != null && !response['_id']) {
          this.userService.createUser().subscribe((response: any) => {
            this.refresh();
          });
        } else {
          this.loading = false;
        }
      });
    }
  }

  private refresh(): void {
    window.location.reload();
  }
}
