"use client";

import clsx from "clsx";
import EmptyState from "../components/EmptyState";
import { useSession } from "next-auth/react";

const Home = () => {
  /*  const { isOpen } = useConversation(); */
  const session = useSession();
  console.log(session);

  return (
    <div className={clsx("lg:pl-80 h-full lg:block", "hidden")}>
      <EmptyState />
    </div>
  );
};

export default Home;
