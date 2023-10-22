import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullMessageType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (message: FullMessageType | { users: User[] }) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;

    const otherUser = message.users.filter((user) => user.email !== currentUserEmail);

    return otherUser[0];
  }, [session.data?.user?.email, message.users]);
  return otherUser;
};

export default useOtherUser;