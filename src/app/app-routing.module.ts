import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
//User Entities
import { UsersComponent } from './users/users/users.component';
import { UsersFormComponent } from './users/users/users-form/users-form.component';
import { FicheUserComponent } from './users/users/fiche-user/fiche-user.component';
import { FicheUserConnectedComponent } from './users/users/fiche-user-connected/fiche-user-connected.component';
//Settings
import { SettingsComponent } from './settings/settings/settings.component';
import { RoleComponent } from './settings/role/role.component';
import { RoleFormComponent } from './settings/role/role-form/role-form.component';
//Clients Entities
import { ClientComponent } from './client/client/client.component';
import { ClientFormComponent } from './client/client/client-form/client-form.component';
import { FicheClientComponent } from './client/client/fiche-client/fiche-client.component';

const routes: Routes = [

  { path: '', component: HomeComponent, },
  { path: 'login', component: LoginComponent },

  //Module User
  {path:'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule)},
  { path: 'user/list', component: UsersComponent },
  { path: 'user/:action', component: UsersFormComponent },
  { path: 'fiche/:action', component: FicheUserComponent },
  { path: 'profile/user', component: FicheUserConnectedComponent },

  //Parametres Divers
  {path:'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)},
  { path: 'parametres', component: SettingsComponent},
  { path: 'role', component: RoleComponent},
  { path: 'role-form', component: RoleFormComponent},

  //Module Client
  {path:'clients', loadChildren: () => import('./client/client.module').then(m => m.ClientModule)},
  { path: 'client/list', component: ClientComponent},
  { path: 'client/:action', component: ClientFormComponent},
  { path: 'fiche/client/:action', component: FicheClientComponent},

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
