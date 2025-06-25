export class StockPointVente {
    produit_id!: number;
    point_de_vente_id!: number;
    quantite!: number;
    variation_id?: number
    combination_hash?: string
    type_produit?: string
    niveau_de_reaprovisionnement!: number
}

export class modelSendStockPointVente  {
    entrepot_id?: number
  TbStockProduit!: StockPointVente[]
}

export class GetStockPointVente {
    id!: number;
}

export class CodeResponseStockPointVente {
    code!: string;
    message!: StockPointVente[];
}

export class CodeResponseOneStockPointVente {
    code!: string;
    message!: StockPointVente;
}
