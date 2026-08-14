export const money=(value?:number)=>value?new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(value):'Price on consultation';
