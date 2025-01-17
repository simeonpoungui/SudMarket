import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from 'src/app/core/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/Services/global.service';
import { ArticlesDeVentes, Vente } from 'src/app/Models/vente.model';
import { VenteService } from 'src/app/Services/vente.service';
import { GetUser, Utilisateur } from 'src/app/Models/users.model';
import { Client, GetClient } from 'src/app/Models/clients.model';
import { ClientsService } from 'src/app/Services/clients.service';
import { ArticlesCommandesAchatsService } from 'src/app/Services/articles-commandes-achats.service';
import { ArticlesDeCommandeDAchat } from 'src/app/Models/articles.commandes.achats';
import { ArticlesDeVenteService } from 'src/app/Services/articles-de-vente.service';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { ProduitService } from 'src/app/Services/produit.service';

@Component({
  selector: 'app-fiche-article-de-commande',
  templateUrl: './fiche-article-de-commande.component.html',
  styleUrls: ['./fiche-article-de-commande.component.scss']
})
export class FicheArticleDeCommandeComponent {
  action:string = 'view';
  article!: ArticlesDeCommandeDAchat;
  message!: any
  tbProduit!: Produit[]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public globalService: GlobalService,
    private dialog: MatDialog,
    private articleService: ArticlesCommandesAchatsService,
    private produitService: ProduitService,
  ){}

  ngOnInit(): void {
    console.log(this.action);
    const articleJson = localStorage.getItem('SelectArticleDeCommandes');
    if (articleJson) {
      this.article =  JSON.parse(articleJson);
      console.log(this.article);
      
    }
    this.loadProduit()
  }
  
  loadProduit(){
    const produit : GetProduit = {produit_id: 0}
    this.produitService.getList(produit).subscribe(data => {
      console.log(data.message);
      this.tbProduit = data.message
    })
  }

  getProduitName(produit_id: number): string {
    const produit = this.tbProduit.find(p => p.produit_id === produit_id);
    return produit ? (produit.nom ): '';
  }


  deletearticle(){
    const alert = this.dialog.open(AlertComponent)
    alert.componentInstance.content = "Voulez-vous supprimé la vente numéro " + this.article.article_commande_achat_id + ' ?'
    alert.componentInstance.backgroundColor = "danger"
    alert.afterClosed().subscribe(confirmDelete => {
      if (confirmDelete) {
        console.log(this.article);
         this.articleService.delete(this.article).subscribe(data => {
           console.log(data.message);
           this.message = data.message
           this.router.navigateByUrl('article-commande-achat')
           this.globalService.toastShow(this.message,'Succès','success')
         } )
      }
    })
  }
}
