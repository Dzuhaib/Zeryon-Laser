import {createClient} from '@sanity/client';
import {fallbackProducts} from './products';
import {Product} from './types';
const projectId=process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const sanity=projectId?createClient({projectId,dataset:process.env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2025-01-01',useCdn:true,token:process.env.SANITY_API_WRITE_TOKEN}):null;
export async function getProducts():Promise<Product[]>{if(!sanity)return fallbackProducts;try{return await sanity.fetch(`*[_type == "product"]|order(order asc){_id,name,"slug":slug.current,category,price,summary,description,applications,features,included,specifications,"image":image.asset->url,featured}`)}catch{return fallbackProducts}}
export async function getProduct(slug:string){return (await getProducts()).find(p=>p.slug===slug)}
