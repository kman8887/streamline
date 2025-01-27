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
import { GameTableComponent } from './game-table/game-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { GamesService } from './services/games.service';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { PricePipe } from './game-table/price.pipe';
import { InputTextModule } from 'primeng/inputtext';
import { SliderModule } from 'primeng/slider';
import { CalendarModule } from 'primeng/calendar';
import { PriceFilterPipe } from './game-table/price-filter.pipe';
import { ChipModule } from 'primeng/chip';
import { StyleClassModule } from 'primeng/styleclass';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameComponent } from './game/game.component';
import { AuthModule } from '@auth0/auth0-angular';
import { MatDividerModule } from '@angular/material/divider';
import { AccountComponent } from './account/account.component';
import { UserService } from './services/user.service';
import { QueryParamBuilderService } from './services/queryParamBuilder.service';
import { ReviewAddEditComponent } from './reviews/review-add-edit/review-add-edit.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReactionCountPipe } from './game/reaction-count.pipe';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    GameTableComponent,
    PricePipe,
    PriceFilterPipe,
    GameComponent,
    AccountComponent,
    ReviewAddEditComponent,
    ReactionCountPipe,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TagModule,
    ButtonModule,
    PaginatorModule,
    MultiSelectModule,
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
        audience: 'http://localhost:5000',
      },
      httpInterceptor: {
        allowedList: [
          {
            uri: 'http://localhost:5000/api/v1.0/users',
            httpMethod: HttpMethod.Post,
          },
          {
            uri: 'http://localhost:5000/api/v1.0/games/*',
            httpMethod: HttpMethod.Post,
          },
          {
            uri: 'http://localhost:5000/api/v1.0/reviews/*',
            httpMethod: HttpMethod.Put,
          },
          {
            uri: 'http://localhost:5000/api/v1.0/reviews/*',
            httpMethod: HttpMethod.Delete,
          },
        ],
      },
    }),
  ],
  providers: [
    GamesService,
    UserService,
    QueryParamBuilderService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
