"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { FullMessageType } from "@/app/types";
import { IoIosCloudDownload } from "react-icons/io";

import Avatar from "@/app/components/Avatar";
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  data: /* FullMessageType */ any;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);

  const isOwn = session.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user: any) => user.email !== data?.sender?.email)
    .map((user: any) => user.name)
    .join(", ");

  const container = clsx("flex gap-3 p-1 pl-3", isOwn && "justify-end pr-3");
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-app-purple text-white" : "bg-gray-200 dark:text-dark",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );
  const containerTimestamp = clsx(
    "flex gap-3 p-3 items-center",
    isOwn && "justify-end"
  );

  return (
    <>
      {data.isTimestamp ? (
        <div className={containerTimestamp}>
          <div className={avatar}>
            <Avatar user={data.sender} isChatBox />
          </div>
          <div className={body}>
            <div className="flex items-center gap-1">
              <div className="text-sm text-gray-500">{data.sender.name}</div>
              <div className="text-xs text-gray-400">
                {format(new Date(data.createdAt), "p")}
              </div>
            </div>

            {isLast && isOwn && seenList.length > 0 && (
              <div
                className="
            text-xs 
            font-light 
            text-gray-500
            "
              >
                {`Seen by ${seenList}`}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={container}>
          <div className={body}>
            <div className="flex items-center group">
              <div className={message}>
                <ImageModal
                  src={data.image}
                  isOpen={imageModalOpen}
                  onClose={() => setImageModalOpen(false)}
                />
                {data.image ? (
                  <Image
                    alt="Image"
                    height="288"
                    width="288"
                    onClick={() => setImageModalOpen(true)}
                    src={data.image}
                    className="
                object-cover 
                cursor-pointer 
                hover:scale-110 
                transition 
                translate
              "
                  />
                ) : (
                  <p>{data.body}</p>
                )}
              </div>
              {data.image && !isOwn && (
                <a href={data.image} download target="_blank">
                  <IoIosCloudDownload className="text-app-purple h-8 w-8 cursor-pointer ml-3 hidden group-hover:block" />
                </a>
              )}
            </div>

            {isLast && isOwn && seenList.length > 0 && (
              <div
                className="
            text-xs 
            font-light 
            text-gray-500
            "
              >
                {`Seen by ${seenList}`}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBox;
