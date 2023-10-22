'use client'

import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/components/Avatar";
import AvatarGroup from "@/components/AvatarGroups";
import { Message, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiChevronLeft } from "react-icons/hi";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import ProfileModal from "./ProfileModal";
import useActiveList from "@/app/hooks/useActiveList";

interface HeaderProps{
  message: Message &{
    users: User[]
  }
}

const ChatNavbar:React.FC<HeaderProps> = ({
  message
}) => {
  
  const {members}= useActiveList();
  const otherUser = useOtherUser(message);
  const isActive = members.indexOf(otherUser?.email!) !==-1;
  const [drawerOpen,setDrawerOpen] = useState(false);
  const statusText = useMemo(()=>{
    if(message.isGroup){
      return  `${message.users.length} members`;
    }
    return isActive?'Active':"Offline"
  },[message,isActive])
  return ( 
    <>
    <ProfileModal
      data={message}
      isOpen={drawerOpen}
      handleClick={()=>setDrawerOpen(false)}
    />
    <div className="
    rounded-b-lg
    w-full 
    flex 
    bg-sky-200
    border-b-[1px] 
    sm:px-4 
    py-3 
    px-4 
    lg:px-6 
    justify-between 
    items-center 
    shadow-lg">
      <div className="flex gap-3 items-center">
        <Link
          href="/messages" 
          className="
            lg:hidden 
            block 
            text-sky-500 
            hover:text-sky-600 
            transition 
            cursor-pointer
          "
        >
          <HiChevronLeft size={32} />
        </Link>
        {
          message.isGroup ?(
            <AvatarGroup users={message.users}/>
          ):(
              <Avatar user={otherUser}/>
          )
        }
        <div className="flex flex-col">
          <div>
            {message.name || otherUser.name}
          </div>
          <div 
            className="text-sm font-light text-neutral-500"
          >
            {statusText}
          </div>
        </div>
      </div>  
      <HiEllipsisHorizontal
        size={32}
        onClick={() => setDrawerOpen(true)}
        className="
          text-sky-500
          cursor-pointer
          hover:text-sky-600
          transition
        "
      />
    </div>
    </>
   );
}
 
export default ChatNavbar;