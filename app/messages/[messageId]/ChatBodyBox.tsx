"use client";

import Avatar from "@/components/Avatar";
import { FullChatType } from "@/app/types";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

interface ChatBodyBoxProps {
  data: FullChatType;
  isLast: boolean;
}

const ChatBodyBox: React.FC<ChatBodyBoxProps> = ({ data, isLast }) => {
  const session = useSession();
  const isOwn = session?.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(",");
  return (
    <div
      className={`
      flex gap-2 p-4
      ${isOwn && "justify-end"}
     `}
    >
      <div className={`${isOwn && "order-2"}`}>
        <Avatar user={data.sender} />
      </div>
      <div className={`flex flex-col gap-2 ${isOwn && "items-end"}`}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{data.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(data.createdAt), "p")}
          </div>
        </div>
        <div className={`text-sm w-fit overflow-hidden rounded-full py-2 px-3 ${isOwn ? "bg-sky-500 text-white" : "bg-gray-100"}`}>
          <div>{data.body}</div>
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
  );
};

export default ChatBodyBox;
