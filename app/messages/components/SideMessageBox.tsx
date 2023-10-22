'use client'
import { MdOutlineGroupAdd } from "react-icons/md";

import MessageBox from "./MessageBox";
import { useEffect, useMemo, useState } from "react";
import { FullMessageType } from "@/app/types";
import useMessages from "@/app/hooks/useMessages";
import GroupModal from "./GroupModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/libs/pusher";
import { find } from "lodash";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
interface SideMessageBoxProps{
  users:User[],
  initialMessages:FullMessageType[]
}
const SideMessageBox:React.FC<SideMessageBoxProps> = ({
  users,
  initialMessages
}) => {
  
  const session = useSession();
  const router= useRouter();
  const { messageId } = useMessages();
  const [items,setItems]=useState(initialMessages);
  const [isOpen,setIsOpen]=useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const userEmail = session.data?.user?.email;

const pusherKey = useMemo(() => {
  return userEmail || null; 
}, [userEmail]);
  useEffect(() => {
    if(!pusherKey) return;

    const newHandler = (message: FullMessageType) => {
      setItems((current = []) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [message, ...current]
      })
    }
    const updateHandler = (message: FullMessageType) => {
      setItems((current = []) => current.map((currentMessage) => {
        if (currentMessage.id === message.id) {
          return {
            ...currentMessage,
            chats: message.chatIds
          };
        }
        
        return currentMessage;
      }));
    }
    pusherClient.subscribe(pusherKey);
    const removeHandler=(message: FullMessageType)=>{
      setItems((current=[])=>{
        return [...current.filter((convo)=> convo.id !== message.id)]
      })
      if(messageId ===message.id){
        router.push('/conversations')
      }
    }
    pusherClient.bind('message:update', updateHandler)
    pusherClient.bind('message:new',newHandler)
    pusherClient.bind('message:remove',removeHandler)
    return ()=>{
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('message:update',updateHandler)
      pusherClient.unbind('message:new',newHandler)
      pusherClient.unbind('message:remove',removeHandler)
    }
  }, [pusherKey,messageId,router])
  
  return (
    <>
    <GroupModal users={users} isOpen={isOpen} handleClick={handleClick}/>
    <div className="flex w-full flex-col overflow-auto h-full gap-2 p-2">
      <div className=" w-full flex justify-between mb-2 pt-2 box-border px-5">
        <div className="text-2xl font-bold text-sky-900">Messages</div>
        <div
          onClick={() => setIsOpen(true)}
          className="rounded-full p-2  bg-sky-500 cursor-pointer hover:opacity-75 transition"
        >
          <MdOutlineGroupAdd size={20} className="text-rose-100" />
        </div>
      </div>
      {
        items?.map((message)=>(
          <MessageBox key={message.id} data={message} selected={messageId === message.id} />
          
        ))
      }
    </div>
    </>
  );
};

export default SideMessageBox;
