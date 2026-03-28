export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { fetchVipData } from '../../../utils/fetchVipData';

export async function GET() {
  try {
    const data = await fetchVipData();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch VIP data' },
      { status: 500 }
    );
  }
}
