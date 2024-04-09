"use client";

import { User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { MdOutlineGroupAdd } from "react-icons/md";
import clsx from "clsx";
import { find, uniq } from "lodash";

import useConversation from "@/app/hooks/useConversation";
//import { pusherClient } from "@/app/libs/pusher";
import GroupChatModal from "@/app/components/modals/GroupChatModal";
import ConversationBox from "./ConversationBox";
import { FullConversationType, FullMessageType } from "@/app/types";
import { pusherClient } from "@/app/libs/pusher";
import axios from "axios";

interface ConversationListProps {
  initialItems: FullConversationType[];
  users: User[];
  title?: string;
  currentUser: User;
}

const ConversationList: React.FC<ConversationListProps> = ({
  initialItems,
  users,
  currentUser,
}) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessages, setNewMessages] = useState<FullMessageType[]>([]);

  const router = useRouter();
  const session = useSession();

  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) =>
        current.map((currentConversation) => {
          if (currentConversation.id === conversation.id) {
            return {
              ...currentConversation,
              messages: conversation.messages,
            };
          }

          return currentConversation;
        })
      );
    };

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) {
          return current;
        }

        return [conversation, ...current];
      });
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });

      if (conversationId === conversation.id) {
        router.push("/conversations");
      }
    };

    pusherClient.bind("conversation:update", updateHandler);
    pusherClient.bind("conversation:new", newHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind("conversation:update", updateHandler);
      pusherClient.unbind("conversation:new", newHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [pusherKey, router, conversationId]);

  useEffect(() => {
    const fetchMessages = async (conversationId: string) => {
      try {
        const response = await axios.get(
          `/api/messages?conversationId=${conversationId}`
        );
        const fetchedMessages = response.data;
        setNewMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    // Iterate through each item and fetch messages
    items.forEach((item) => {
      fetchMessages(item.messages[0]?.conversationId); // Assuming the key is 'conversationID'
    });
  }, [items]);

  const unseeenCount = useMemo(() => {
    let count = 0;
    for (let i = newMessages.length - 1; i >= 0; i--) {
      const message = newMessages[i];
      if (!message.seenIds.includes(currentUser.id)) {
        if (
          i === newMessages.length - 1 ||
          !newMessages[i + 1].seenIds.includes(currentUser.id)
        ) {
          count++;
        } else {
          break; // Stop counting if the previous message of the last message contains your ID
        }
      }
    }
    return count;
  }, [newMessages, currentUser]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `
        fixed 
        inset-y-0 
        pb-20
        lg:pb-0
        lg:left-20 
        lg:w-80 
        lg:block
        overflow-y-auto 
        border-r 
        border-gray-200 
        bg-white
        dark:bg-dark
        dark:border-r-[#424242]
      `,
          isOpen ? "hidden" : "block w-full left-0"
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800 dark:text-white">
              Messages
            </div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="
                rounded-full 
                p-2 
                bg-gray-100 
                dark:bg-app-purple
                dark:text-white
                hover:dark:bg-user-list
                hover:dark:text-white 
                text-gray-600 
                cursor-pointer 
                transition
              "
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
              totalUnseenCount={unseeenCount}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
