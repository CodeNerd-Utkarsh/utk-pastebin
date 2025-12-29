import { createAccessToken, createRefreshToken, verifyPassword } from "@/lib/auth";
import { getdb } from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return new NextResponse('Email and password are required', { status: 400 })
        }
        const db = await getdb();
        const users = db.collection('users');
        const existingUsers = await users.findOne({ email })

        if (!existingUsers) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
        }

        const ok = await verifyPassword(password, existingUsers.hashedPassword)
        if (!ok) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
        }

        const accessToken = await createAccessToken(existingUsers._id.toString())
        const refreshToken = await createRefreshToken(existingUsers._id.toString())

        const res = NextResponse.json({ accessToken, ok: true }, { status: 200 })


        // Store refresh token securely in httpOnly cookie
        res.cookies.set('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24, // 1 day
        });

        return res;

    }
    catch (err) {
        console.error(err);

        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}