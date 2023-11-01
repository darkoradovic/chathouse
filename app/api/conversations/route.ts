import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export const POST = async (req: NextRequest) => {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser.email) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return NextResponse.json("Invalid data", { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma?.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            //connecting the users to that conversation
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      return NextResponse.json(newConversation);
    }

    //check for single conversation
    const existingConversation = await prisma?.conversation.findMany({
      where: {
        OR: [
          /* had to do duplicate to cover both casses */
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleConversation = existingConversation![0];

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma?.conversation.create({
      data: {
        users: {
          connect: [{ id: currentUser.id }, { id: userId }],
        },
      },
      include: {
        users: true,
      },
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    return NextResponse.json("Internal server error", { status: 500 });
  }
};
