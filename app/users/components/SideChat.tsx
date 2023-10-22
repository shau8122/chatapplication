'use client'
import { User } from "@prisma/client";
import MemberBox from "./MemberBox";
interface SideChatProps{
  users:User[],
}
const SideChat:React.FC<SideChatProps> = ({
  users,
}) => {
  
  return (
    <div className="flex w-full flex-col overflow-auto h-full gap-2 p-2">
      <div className=" w-full flex justify-between mb-2 pt-2 box-border px-5">
        <div className="text-2xl font-bold text-sky-900">Users</div>
      </div>
      {
        users.map((user)=>(
          <MemberBox key={user.id} data={user} />
        ))
      }
    </div>
  );
};

export default SideChat;
