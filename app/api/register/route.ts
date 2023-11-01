import { hash } from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, image } = (await req.json()) as {
      name: string;
      email: string;
      password: string;
      image: string;
    };
    const hashed_password = await hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        hashedPassword: `${hashed_password}`,
        image: image,
      },
    });

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        password: user.hashedPassword,
        image: user.image,
      },
    });
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({
        status: "error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
}
