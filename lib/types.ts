export type Product={_id:string;name:string;slug:string;category:string;price?:number;summary:string;description:string;applications:string[];features:string[];included:string[];specifications:{label:string;value:string}[];image?:string;featured?:boolean};
export type CartItem={product:Product;quantity:number};
