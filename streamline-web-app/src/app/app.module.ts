import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthHttpInterceptor, HttpMethod } from '@auth0/auth0-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './navbar/navbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MovieTableComponent } from './movie-table/movie-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MoviesService } from './services/movies.service';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { PricePipe } from './movie-table/price.pipe';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';
import { RatingsFilterPipe } from './movie-table/ratings-filter.pipe';
import { ChipModule } from 'primeng/chip';
import { StyleClassModule } from 'primeng/styleclass';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MovieComponent } from './movie/movie.component';
import { AuthModule } from '@auth0/auth0-angular';
import { MatDividerModule } from '@angular/material/divider';
import { AccountComponent } from './account/account.component';
import { UserService } from './services/user.service';
import { QueryParamBuilderService } from './services/queryParamBuilder.service';
import { ReviewAddEditComponent } from './reviews/review-add-edit/review-add-edit.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReactionCountPipe } from './movie/reaction-count.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { TimePipe } from './movie/time.pipe';
import { LikeButtonComponent } from './common/likeButton.component';
import { HttpContextInterceptor } from './interceptors/httpContext.interceptor';
import { WatchButtonComponent } from './common/watchButton.component';
import { RatingModule } from 'primeng/rating';
import { RatingsOnboardingComponent } from './ratings/ratings-onboarding/ratings-onboarding.component';
import { RatingsOnboardingDynamicDialogComponent } from './ratings/ratings-onboarding-dynamic-dialog/ratings-onboarding-dynamic-dialog.component';
import { StarRatingComponent } from './common/starRating.component';
import { PeoplePipe } from './movie/people.pipe';
import { ReviewCardComponent } from './reviews/review-card/review-card.component';
import { ReviewTableComponent } from './reviews/review-table/review-table.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CarouselModule } from 'primeng/carousel';
import { CarouselCardComponent } from './carousel-card/carousel-card.component';
import { SkeletonModule } from 'primeng/skeleton';
import { GalleriaModule } from 'primeng/galleria';
import { MatchBadgeComponent } from './common/match-badge/match-badge.component';
import { WatchlistButtonComponent } from './common/watchlist-button/watchlist-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TooltipModule } from 'primeng/tooltip';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { WatchlistcardComponent } from './watchlist/watchlistcard/watchlistcard.component';
import { ListboxModule } from 'primeng/listbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SettingsComponent } from './settings/settings.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { StepperModule } from 'primeng/stepper';
import { StepsModule } from 'primeng/steps';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PasswordModule } from 'primeng/password';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { environment } from '../environments/environments';
import { FooterComponent } from './footer/footer.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { LoadingService } from './services/loading.service';
import { CheckboxModule } from 'primeng/checkbox';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MovieTableComponent,
    MovieCardComponent,
    PricePipe,
    RatingsFilterPipe,
    TimePipe,
    MovieComponent,
    AccountComponent,
    ReviewAddEditComponent,
    ReactionCountPipe,
    LikeButtonComponent,
    WatchButtonComponent,
    RatingsOnboardingComponent,
    RatingsOnboardingDynamicDialogComponent,
    StarRatingComponent,
    PeoplePipe,
    ReviewCardComponent,
    ReviewTableComponent,
    HomepageComponent,
    CarouselCardComponent,
    MatchBadgeComponent,
    WatchlistButtonComponent,
    WatchlistComponent,
    WatchlistcardComponent,
    SettingsComponent,
    OnboardingComponent,
    FooterComponent,
    AboutUsComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatButtonToggleModule,
    ToastModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    CheckboxModule,
    StepperModule,
    SkeletonModule,
    TooltipModule,
    ProgressBarModule,
    MatTableModule,
    PasswordModule,
    MatTooltipModule,
    FloatLabelModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    InputIconModule,
    IconFieldModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TagModule,
    ListboxModule,
    GalleriaModule,
    RatingModule,
    ButtonModule,
    PaginatorModule,
    MultiSelectModule,
    StepsModule,
    CarouselModule,
    InputTextModule,
    SliderModule,
    CalendarModule,
    ChipModule,
    StyleClassModule,
    FontAwesomeModule,
    MatDividerModule,
    InputSwitchModule,
    ToastModule,
    DialogModule,
    InputTextareaModule,
    ProgressSpinnerModule,
    AuthModule.forRoot({
      domain: 'dev-n20bicxbia0qquf1.eu.auth0.com',
      clientId: 'SyeXGFhQ4pYYjgoEkPziyIa1Aca9T7y7',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: environment.audienceUrl,
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: `${environment.apiUrl}/v1.0/movies/*`,
            httpMethod: HttpMethod.Get,
            allowAnonymous: true,
          },
          {
            uri: `${environment.apiUrl}/v1.0/movies`,
            httpMethod: HttpMethod.Get,
            allowAnonymous: true,
          },
          {
            uri: `${environment.apiUrl}/v1.0/movies/onboarding`,
            httpMethod: HttpMethod.Get,
          },
          {
            uri: `${environment.apiUrl}/v1.0/recommendation/generate`,
            httpMethod: HttpMethod.Get,
          },
          {
            uri: `${environment.apiUrl}/v1.0/movies/watchlist`,
            httpMethod: HttpMethod.Get,
          },
          {
            uri: `${environment.apiUrl}/v1.0/users`,
            httpMethod: HttpMethod.Post,
          },
          {
            uri: `${environment.apiUrl}/v1.0/users/*`,
            httpMethod: HttpMethod.Post,
          },
          {
            uri: `${environment.apiUrl}/v1.0/users/*`,
            httpMethod: HttpMethod.Put,
          },
          {
            uri: `${environment.apiUrl}/v1.0/users/*`,
            httpMethod: HttpMethod.Get,
            allowAnonymous: true,
          },
          {
            uri: `${environment.apiUrl}/v1.0/movies/*`,
            httpMethod: HttpMethod.Post,
          },
          {
            uri: `${environment.apiUrl}/v1.0/reviews/*`,
            httpMethod: HttpMethod.Put,
          },
          {
            uri: `${environment.apiUrl}/v1.0/reviews/*`,
            httpMethod: HttpMethod.Post,
          },
          {
            uri: `${environment.apiUrl}/v1.0/reviews/*`,
            httpMethod: HttpMethod.Delete,
          },
        ],
      },
    }),
  ],
  providers: [
    MoviesService,
    UserService,
    DialogService,
    LoadingService,
    MessageService,
    QueryParamBuilderService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpContextInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
