import { createAccessToken, verifyToken } from "@/lib/auth";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const refresh = (await cookies()).get('refresh_token')?.value;
    if (!refresh) {
        return new NextResponse('Refresh token missing', { status: 401 })
    }

    const payload = verifyToken(refresh) as JwtPayload | null;
    if (!payload || (payload as JwtPayload).type !== 'refresh') {
        return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    const newAccessToken = createAccessToken((payload as JwtPayload).uid);
    return NextResponse.json({ ok: true, accessToken: newAccessToken });

}