import { NextResponse } from 'next/server';
import { NeynarAPIClient, Configuration } from '@neynar/nodejs-sdk';

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY!,
});

const client = new NeynarAPIClient(config);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const fid = body.fid;
    if (!fid) return NextResponse.json({ error: 'Missing fid' }, { status: 400 });

    const { users } = await client.fetchBulkUsers({ fids: [fid] });
    const user = users[0];

    return NextResponse.json({
      fid: user.fid,
      username: user.username,
      display_name: user.display_name,
      pfp_url: user.pfp_url,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
