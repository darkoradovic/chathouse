"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useConversation from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/app/types";
import { find } from "lodash";
import { pusherClient } from "@/app/libs/pusher";
import { useSession } from "next-auth/react";
import { MessageLoader } from "./MessageLoader";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {
  const session = useSession();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    console.log(messages);

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  /*   const groupedMessages = messages.reduce((acc: any, message) => {
    const timestamp = new Date(message.createdAt);
    const minuteKey = timestamp.toISOString().substr(0, 17); // Extracting timestamp minute

    // If the minuteKey doesn't exist, create it and initialize with an empty array
    if (!acc[minuteKey]) {
      acc[minuteKey] = [];
    }

    // Push the message to the array corresponding to the minuteKey
    acc[minuteKey].push(message);

    return acc;
  }, {});

  console.log(
    Object.values(groupedMessages).map((s: any) => s.map((d: any) => d.id))
  ); */

  const groupedMessages: any = [];

  let previousMessageMinute: any;

  messages.forEach((message) => {
    const messageTime = new Date(message.createdAt);
    const currentMinute = messageTime.getMinutes();

    if (currentMinute !== previousMessageMinute) {
      groupedMessages.push({
        isTimestamp: true,
        createdAt: messageTime,
        avatar: message.sender.image,
        sender: message.sender,
      });
    }
    groupedMessages.push(message);

    previousMessageMinute = currentMinute;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-dark">
      {session?.status === "loading" ? (
        <MessageLoader />
      ) : (
        groupedMessages.map((message: any, i: number) => {
          return (
            <MessageBox
              isLast={i === groupedMessages.length - 1}
              key={message.id}
              data={message}
            />
          );
        })
      )}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
