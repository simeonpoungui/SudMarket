export class Facture {
    facture_id!: number;
    vente_id!: number;
    numero_facture!: string;
    date_facture!: Date;
    montant_total!: number;
    mode_de_paiement!: string;
    client_id!: number;
    client_nom?: string;  
  }
  