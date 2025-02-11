import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const RANK_MULTIPLIERS = [
  { name: "25", multiplier: 1.105 },
  { name: "24", multiplier: 1.101 },
  { name: "23", multiplier: 1.099 },
  { name: "22", multiplier: 1.097 },
  { name: "21", multiplier: 1.095 },
  { name: "20", multiplier: 1.093 },
  { name: "19", multiplier: 1.09 },
  { name: "18", multiplier: 1.087 },
  { name: "17", multiplier: 1.084 },
  { name: "16", multiplier: 1.081 },
  { name: "15", multiplier: 1.076 },
  { name: "14", multiplier: 1.054 },
  { name: "13", multiplier: 1.046 },
  { name: "12", multiplier: 1.039 },
  { name: "11", multiplier: 1.011 },
  { name: "10", multiplier: 1.0 },
];

export async function GET() {
  try {
    const response = await fetch('https://kumamate.net/vip/');
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // VIPボーダー値を取得
    const vipBorderText = $('.vipborder').text();
    const vipBorder = parseInt(vipBorderText.replace(/,/g, ''));

    return NextResponse.json({ 
      vipBorder, 
      ranks: RANK_MULTIPLIERS 
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch VIP data' }, 
      { status: 500 }
    );
  }
} 