"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Conversation, Message, User } from "@prisma/client";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import clsx from "clsx";

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import AvatarGroup from "@/app/components/AvatarGroup";
import { FullConversationType, FullMessageType } from "@/app/types";

interface ConversationBoxProps {
  data: FullConversationType;
  selected?: boolean;
  totalUnseenCount?: number;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
  data,
  selected,
  totalUnseenCount,
}) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();
  const [buttonClicked, setButtonClicked] = useState(false);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(
    () => session.data?.user?.email,
    [session.data?.user?.email]
  );

  const hasSeen = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const seenArray = lastMessage.seen || [];

    if (!userEmail) {
      return false;
    }

    return seenArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage, buttonClicked]);

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`);
    setButtonClicked(true);
  }, [data, router]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return "Sent an image";
    }

    if (lastMessage?.body) {
      return lastMessage?.body;
    }

    return "Started a conversation";
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full 
        relative 
        flex 
        items-center 
        space-x-3 
        p-3 
        hover:bg-neutral-100
        dark:bg-user-list
        rounded-lg
        transition
        cursor-pointer
        mb-2
        `,
        selected ? "bg-neutral-100" : "bg-gray-100"
      )}
    >
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={otherUser} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900 dark:text-gray-100">
              {data.name || otherUser.name}
            </p>
            {lastMessage?.createdAt && (
              <p
                className="
                  text-xs 
                  text-gray-400 
                dark:text-gray-100
                  font-light
                "
              >
                {format(new Date(lastMessage.createdAt), "p")}
              </p>
            )}
          </div>
          <div className="flex  items-center">
            {!hasSeen && (
              <div className="bg-app-purple rounded-md text-white py-[2px] px-[6px] mr-2 text-[10px]">
                new
              </div>
            )}
            <p
              className={clsx(
                `
              truncate 
              text-sm
              `,
                hasSeen
                  ? "text-gray-500 dark:text-white"
                  : "text-black font-bold dark:text-white"
              )}
            >
              {lastMessageText}
            </p>
            {/*  {!hasSeen && totalUnseenCount !== 0 && (
              <div className="bg-app-purple text-white p-1 rounded-[50%] text-xs ">
                <p className="flex items-center justify-center w-4 font-extrabold">
                  {totalUnseenCount}
                </p>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationBox;
