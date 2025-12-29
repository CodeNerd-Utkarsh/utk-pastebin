import { hashPassword } from "@/lib/auth";
import { getdb } from "@/lib/mongo";
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json()
        if (!email || !password) {
            return new NextResponse('Email and password are required', { status: 400 })
        }

        const db = await getdb();
        const users = db.collection('users');
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User email already in use' }, { status: 409 })
        }

        const hashedPassword = await hashPassword(password);
        await users.insertOne({ email, hashedPassword, createdAt: new Date() })
        return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
    }
    catch (error) {
        console.error(error);
        return new NextResponse('Invalid request body', { status: 400 })
    }
}