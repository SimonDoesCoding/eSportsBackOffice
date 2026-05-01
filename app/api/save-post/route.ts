import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = 'https://bhdvltxqdhouvycyxwft.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZHZsdHhxZGhvdXZ5Y3l4d2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDM2ODYsImV4cCI6MjA3NjExOTY4Nn0.mIVyn9Thbz7G3FMgnys5jC9iJFa0kBMAlWu9oi1vuYs';

export async function POST(request: NextRequest) {
  try {
    const { fixtureId, platform, content } = await request.json();

    const res = await fetch(`${SUPABASE_URL}/rest/v1/SocialPosts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        fixture_id: fixtureId,
        platform,
        content,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: `Failed to save: ${error}` }, { status: 500 });
  }
}
