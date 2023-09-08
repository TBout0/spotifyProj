import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpotifyComponent } from './spotify/spotify.component';

const routes: Routes = [
  {
    path: 'spotify',
    component: SpotifyComponent,
  },
  { path: '', redirectTo: '/spotify', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
