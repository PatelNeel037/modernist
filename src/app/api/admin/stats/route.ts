import { NextResponse } from 'next/server';
import { MockOrderStore } from '@/lib/mock-store';

export async function GET() {
    return NextResponse.json(MockOrderStore.getStats());
}
