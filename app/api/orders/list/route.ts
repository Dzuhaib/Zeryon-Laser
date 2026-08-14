import {NextResponse} from 'next/server';import {sanity} from '@/lib/sanity';
export async function GET(req:Request){if(req.headers.get('x-admin-key')!==process.env.ADMIN_ACCESS_KEY)return NextResponse.json({error:'Unauthorised'},{status:401});if(!sanity)return NextResponse.json([]);const orders=await sanity.fetch(`*[_type == "order"]|order(createdAt desc)`);return NextResponse.json(orders)}
