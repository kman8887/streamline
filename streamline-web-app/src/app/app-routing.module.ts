import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovieTableComponent } from './movie-table/movie-table.component';
import { MovieComponent } from './movie/movie.component';
import { AccountComponent } from './account/account.component';
import { HomepageComponent } from './homepage/homepage.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'movies',
    component: MovieTableComponent,
  },
  {
    path: 'movies/:id',
    component: MovieComponent,
  },
  {
    path: 'user/:id',
    component: AccountComponent,
  },
  {
    path: 'lists',
    component: WatchlistComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
