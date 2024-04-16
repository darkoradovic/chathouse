import dynamic from "next/dynamic";
import getConversations from "../actions/getConversations";
import getCurrentUser from "../actions/getCurrentUser";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
//import ConversationList from "./components/ConversationList";
const ConversationList = dynamic(
  () => import("./components/ConversationList"),
  { ssr: false }
);

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();
  const users = await getUsers();
  const currentUser = await getCurrentUser();

  return (
    //@ts-ignore
    <Sidebar>
      <div className="h-full">
        <ConversationList
          users={users!}
          title="Messages"
          initialItems={conversations!}
          currentUser={currentUser!}
        />
        {children}
      </div>
    </Sidebar>
  );
}
