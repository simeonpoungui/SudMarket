export class Entrepot {
    entrepot_id!: number;                 
    nom!: string;                 
    adresse!: string;              
    responsable!: string;         
    capacite_stockage!: number;  
    email!: string
    telephone!: string
    ville!: string  
    cree_le!: Date;                
    produit_id?: any;
}

export class GetEntrepot {
    entrepot_id!: number;                   
}

export class CodeResponse {
    code!: string;                 
    message!: Entrepot[];         
}

export class CodeResponseOneEntrepot {
    code!: string;                
    message!: Entrepot;           
}

export class StocksEntrepots {
    variation_id?: number
    combination_hash?: string
    sku?: string
    produit_id!: number;                 
    quantite!: number;    
    type_produit?: string                         
}

export class ModelSendAddProductEntrepot{
    entrepot_id!: number;                 
    tbStockEntrepots!: StocksEntrepots[]
}

