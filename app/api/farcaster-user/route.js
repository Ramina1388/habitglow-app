import { NextResponse } from 'next/server';
import { NeynarAPIClient, Configuration } from "@neynar/nodejs-sdk";

const config = new Configuration({
  apiKey: process.env.NEYNAR_API_KEY,
  baseOptions: {
    headers: {
      "x-neynar-experimental": true
    }
  }
});

const client = new NeynarAPIClient(config);

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
