import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { EditProfile } from './pages/edit-profile/edit-profile';
import { AdminCreate } from './pages/admin-create/admin-create';
import { AuthGuard } from './auth.guard';
import { Cart } from './pages/cart/cart';
import { GameEdit } from './pages/edit-game/edit-game';
import { MyGames } from './pages/mygame/mygame';
import { Checktransaction } from './pages/checktransaction/checktransaction';
import { AdminCode } from './pages/admin-code/admin-code';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'cart', component: Cart},
  { path: 'mygame', component: MyGames},
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
  { path: 'edit-profile', component: EditProfile, canActivate: [AuthGuard], data: { role: 'user' } },
  { path: 'admin/create', component: AdminCreate, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'admin/code', component: AdminCode, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'game-edit/:id', component: GameEdit, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: 'checktransaction', component: Checktransaction, canActivate: [AuthGuard], data: { role: 'admin' } },
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
