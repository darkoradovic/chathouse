import getCurrentUser from "../actions/getCurrentUser";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import UserList from "./components/UserList";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();
  const currentUser = await getCurrentUser();

  return (
    //@ts-ignore
    <Sidebar>
      <div className="h-full">
        <UserList items={users!} currentUser={currentUser!} />
        {children}
      </div>
    </Sidebar>
  );
}
