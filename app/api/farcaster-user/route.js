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
    const response = await client.users.getUserByFid(fid);
    return NextResponse.json({
      pfpUrl: response.result.user.pfp_url,
      username: response.result.user.username,
      displayName: response.result.user.display_name,
      bio: response.result.user.profile.bio.text,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
