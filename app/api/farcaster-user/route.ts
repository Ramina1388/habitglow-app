import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');
  if (!fid) {
    return NextResponse.json({ error: 'Missing fid' }, { status: 400 });
  }
  try {
    const res = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        accept: 'application/json',
        api_key: process.env.NEYNAR_API_KEY as string,
      },
    });
    const json = await res.json();
    const user = json.users?.[0];
    if (!user) return NextResponse.json({ error: 'No user found' }, { status: 404 });
    return NextResponse.json({
      pfpUrl: user.pfp_url,
      username: user.username,
      displayName: user.display_name,
      bio: user.profile.bio.text,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
