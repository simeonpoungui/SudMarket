import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
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
import { NotificationsStockProduitsComponent } from './settings/notifications-stock-produits/notifications-stock-produits.component';
//Clients Entities
import { ClientComponent } from './client/client/client.component';
import { ClientFormComponent } from './client/client/client-form/client-form.component';
import { FicheClientComponent } from './client/client/fiche-client/fiche-client.component';
//Fournisseur Entities
import { FournisseurComponent } from './fournisseur/fournisseur/fournisseur.component';
import { FournisseurFicheComponent } from './fournisseur/fournisseur-fiche/fournisseur-fiche.component';
import { FournisseurFormComponent } from './fournisseur/fournisseur-form/fournisseur-form.component';
//Produit Entities
import { ProduitComponent } from './produit/produit/produit.component';
import { ProduitFicheComponent } from './produit/produit-fiche/produit-fiche.component';
import { ProduitFormComponent } from './produit/produit-form/produit-form.component';
//Commandes Achat Entities
import { CommandeAChatComponent } from './commande-achat/commande-achat/commande-achat.component';
import { CommandeAChatFicheComponent } from './commande-achat/commande-achat-fiche/commande-achat-fiche.component';
import { CommandeAChatFormComponent } from './commande-achat/commande-achat-form/commande-achat-form.component';
//Vente Entities
import { VenteComponent } from './vente/vente/vente.component';
import { VenteFicheComponent } from './vente/vente-fiche/vente-fiche.component';
import { VenteFormComponent } from './vente/vente-form/vente-form.component';
import { ArticleDeVentesComponent } from './vente/article-de-ventes/article-de-ventes.component';
//Rapport Entities
import { RapportComponent } from './rapport/rapport/rapport.component';
import { RapportFicheComponent } from './rapport/rapport-fiche/rapport-fiche.component';
import { RapportFormComponent } from './rapport/rapport-form/rapport-form.component';

//Scanner
import { ScannerComponent } from './scanner-qrcode/scanner/scanner.component';
import { SessionGuardService } from './Services/session-guard.service';

//Session vente
import { SessionVenteComponent } from './session-vente/session-vente/session-vente.component';
import { ListSessionVenteComponent } from './session-vente/list-session-vente/list-session-vente.component';


const routes: Routes = [
  { path: '', component: HomeComponent, },
  { path: 'login', component: LoginComponent },

  //Module User
  {path:'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule)},
  { path: 'user/list', component: UsersComponent },
  { path: 'user/:action', component: UsersFormComponent},
  { path: 'fiche/:action', component: FicheUserComponent },
  { path: 'profile/user', component: FicheUserConnectedComponent },

  //Module Settings
  {path:'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)},
  { path: 'parametres', component: SettingsComponent},
  { path: 'role', component: RoleComponent},
  { path: 'role-form', component: RoleFormComponent},
  { path: 'notification-produit-stock', component: NotificationsStockProduitsComponent},


  //Module Client
  {path:'clients', loadChildren: () => import('./client/client.module').then(m => m.ClientModule)},
  { path: 'client/list', component: ClientComponent},
  { path: 'client/:action', component: ClientFormComponent},
  { path: 'fiche/client/:action', component: FicheClientComponent},

  // Module Fournisseur
  {path:'fournisseurs', loadChildren: () => import('./fournisseur/fournisseur.module').then(m => m.FournisseurModule)},
  {path: 'fournisseur/list', component: FournisseurComponent},
  {path: 'fournisseur/view', component: FournisseurFicheComponent},
  {path: 'fournisseur/:action', component: FournisseurFormComponent},

  // Module Produit
  {path:'produits', loadChildren: () => import('./produit/produit.module').then(m => m.ProduitModule)},
  {path: 'produit/list', component: ProduitComponent},
  {path: 'produit/view', component: ProduitFicheComponent},
  {path: 'produit/:action', component: ProduitFormComponent},

  // Module Vente
  {path:'ventes', loadChildren: () => import('./vente/vente.module').then(m => m.VenteModule)},
  {path: 'vente/list', component: VenteComponent},
  {path: 'vente/view', component: VenteFicheComponent},
  {path: 'vente/:action', component: VenteFormComponent},
  {path: 'articles-de-vente', component: ArticleDeVentesComponent},


  // Module commande achat
  {path:'commandes-achats', loadChildren: () => import('./commande-achat/commande-achat.module').then(m => m.CommandeAchatModule)},
  {path: 'commande/achat/list', component: CommandeAChatComponent},
  {path: 'commande/achat/view', component: CommandeAChatFicheComponent},
  {path: 'commande/achat/:action', component: CommandeAChatFormComponent},

  // Module rapport
  {path:'rapports', loadChildren: () => import('./rapport/rapport.module').then(m => m.RapportModule)},
  {path: 'rapport/list', component: RapportComponent},
  {path: 'rapport/view', component: RapportFicheComponent},
  {path: 'rapport/:action', component: RapportFormComponent},

  // Module QRCODE
  {path:'qrcode', loadChildren: () => import('./scanner-qrcode/scanner-qrcode.module').then(m => m.ScannerQrcodeModule)},
  {path: 'scanner', component: ScannerComponent},

  // Module Session vente
  {path:'session-ventes', loadChildren: () => import('./session-vente/session-vente.module').then(m => m.SessionVenteModule)},
  {path: 'session-vente', component: SessionVenteComponent},
  {path: 'session-vente-list', component: ListSessionVenteComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
