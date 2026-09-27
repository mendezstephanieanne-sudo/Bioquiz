import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const guestEmail = "guest@bioquiz.invalid";

export async function POST() {
  try {
    const guest = await prisma.user.upsert({
      where: { email: guestEmail },
      update: {},
      create: {
        name: "Guest",
        email: guestEmail,
        password: await bcrypt.hash(randomBytes(32).toString("hex"), 10),
      },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ success: true, user: guest });
  } catch (error) {
    console.error("Guest start error:", error);
    return NextResponse.json(
      { error: "Unable to start a quiz. Check the database connection." },
      { status: 500 }
    );
  }
}