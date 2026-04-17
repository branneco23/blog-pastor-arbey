import { NextResponse } from 'next/server';

export async function GET() {
  const RADIO_URL = "https://server6.mpro.com.co:8102/;stream.mp3";
  
  const response = await fetch(RADIO_URL, {
    headers: { 'Icy-MetaData': '1' }
  });

  return new NextResponse(response.body, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
    },
  });
}