import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GetProduit, Produit } from 'src/app/Models/produit.model';
import { Utilisateur } from 'src/app/Models/users.model';
import { ArticlesDeVentes, Facture, Vente } from 'src/app/Models/vente.model';
import { GlobalService } from 'src/app/Services/global.service';
import { ProduitService } from 'src/app/Services/produit.service';
import { VenteService } from 'src/app/Services/vente.service';
import { ArticleDeVentesComponent } from 'src/app/vente/article-de-ventes/article-de-ventes.component';

@Component({
  selector: 'app-print-recu',
  templateUrl: './print-recu.component.html',
  styleUrls: ['./print-recu.component.scss']
})
export class PrintRecuComponent {

  montant_total!: number
  vente!: Vente
  Facture!: any
  user!: Utilisateur;
  Tbarticles!: ArticlesDeVentes[]
  tbProduit!: Produit[];
  mode_de_paiement!: string
  
  constructor(
    public globalService: GlobalService,
    private router : Router,
    private produitService: ProduitService,
    private venteService: VenteService
  ){}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      console.log(this.user);
    }

    const mode_de_paiement = localStorage.getItem('mode_de_paiement');
    if (mode_de_paiement) {
      this.mode_de_paiement = JSON.parse(mode_de_paiement);
      console.log(this.mode_de_paiement);
    }
    
    const venteFromStorage = localStorage.getItem('vente');
    if (venteFromStorage) {
      const venteParsed = JSON.parse(venteFromStorage);
      console.log(venteParsed);
      this.Tbarticles = venteParsed.articles
      console.log(this.Tbarticles);
      
      this.vente = venteParsed
      this.montant_total = venteParsed.montant_total
    }
    

    const factureFromStorage = localStorage.getItem('facture');
    if (factureFromStorage) {
      const factureParsed = JSON.parse(factureFromStorage);
      this.Facture = factureParsed
      console.log(this.Facture);
    }

    this.getListProduit();


  }

  back() {
   this.router.navigateByUrl(('/session-vente/' + this.user.point_de_vente_id))
  }
  
  getListProduit() {
    const point_de_vente_id: GetProduit = {
      produit_id: 0,
    };
    this.produitService.getList(point_de_vente_id).subscribe(res =>{
      console.log(res.message);
      this.tbProduit = res.message
    })
  }


  getProduitName(produit_id: number): string {
    const produit = this.tbProduit.find((p) => p.produit_id === produit_id);
    return produit ? produit.nom : '';
  }

  imprimerPDFFacture() {
    this.venteService.ImpressionFacture(this.Facture,this.vente).subscribe((data) => {
      console.log(data);
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'Rapport_de_cloture_de_caisse.pdf';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      const pdfWindow = window.open('');
      if (pdfWindow) {
        pdfWindow.document.write(
          "<iframe width='100%' height='100%' style='border:none' src='" +
            url +
            "'></iframe>"
        );
      }
    });
  }

  imprimerPDFFactureDiv() {
    this.venteService.ImpressionFacture(this.Facture, this.vente).subscribe((data) => {
      console.log(data);
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
  
      // Créez l'élément <iframe> et définissez l'URL comme source
      const iframe = document.createElement('iframe');
      iframe.src = url;
      iframe.width = '100%';
      iframe.height = '600px'; // ou la hauteur que vous préférez
      iframe.style.border = 'none';
  
      // Trouvez la div où vous voulez afficher le PDF et ajoutez-y l'iframe
      const pdfContainer = document.getElementById('pdf-container'); // Assurez-vous que cette div existe dans votre HTML
      if (pdfContainer) {
        pdfContainer.innerHTML = ''; // Effacez tout contenu précédent de la div
        pdfContainer.appendChild(iframe); // Ajoutez l'iframe dans la div
      }
    });
  }
  

}
