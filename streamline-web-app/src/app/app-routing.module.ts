import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameTableComponent } from './game-table/game-table.component';
import { GameComponent } from './game/game.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/games',
    pathMatch: 'full',
  },
  {
    path: 'games',
    component: GameTableComponent,
  },
  {
    path: 'games/:id',
    component: GameComponent,
  },
  {
    path: 'user/:id',
    component: AccountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
