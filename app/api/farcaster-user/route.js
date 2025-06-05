import { NextResponse } from 'next/server';
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fid = searchParams.get('fid');
  if (!fid) {
    return NextResponse.json({ error: "Missing fid" }, { status: 400 });
  }
  try {
    const { result } = await client.lookupUserByFid(fid);
    return NextResponse.json({
      pfpUrl: result.user.pfp.url,
      username: result.user.username,
      displayName: result.user.display_name,
      bio: result.user.profile.bio.text
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
