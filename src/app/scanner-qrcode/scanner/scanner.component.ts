import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ZXingScannerComponent, ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent {

 formats: BarcodeFormat[] = [
    BarcodeFormat.QR_CODE,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93
  ];

  productInfo: any = null; // Variable pour stocker les informations du produit scanné

  constructor(private http: HttpClient) {}

  onScanSuccess(result: any) {
    const codeContent = result?.codeResult?.code;
    if (codeContent) {
      this.fetchProductDetails(codeContent);
    }
  }

  fetchProductDetails(codeContent: string) {
    this.http.post<any>('http://votre-backend.com/recuperer_infos_produit.php', { code: codeContent })
      .subscribe(response => {
        console.log(response); // Afficher les données récupérées dans la console
        this.productInfo = response.message; // Stocker les informations du produit
      }, error => {
        console.error('Erreur lors de la récupération des informations du produit :', error);
      });
  }
}
