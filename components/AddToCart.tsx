'use client';import {ShoppingBag} from 'lucide-react';import {Product} from '@/lib/types';import {useCart} from './CartProvider';
export function AddToCart({product}:{product:Product}){const{add}=useCart();return <button className="button" onClick={()=>add(product)}><ShoppingBag size={17}/> Add to cart</button>}
