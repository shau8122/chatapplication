'use client'


import useOtherUser from '@/app/hooks/useOtherUser'
import { FullChatType, FullMessageType } from '@/app/types'
import Avatar from '@/components/Avatar'
import AvatarGroup from '@/components/AvatarGroups'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface UserBoxProps{
  data:FullMessageType,
  selected:boolean
}

const UserBox:React.FC<UserBoxProps> = ({data,selected}) => {
  const router = useRouter();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
 
  
  const otherUser =useOtherUser(data)
  const handleClick= useCallback(()=>{
    router.push(`/messages/${data.id}`);
  },[data.id,router]);
  const lastChat = useMemo(() => {
    const chats = (data.chatIds || []) as unknown as FullChatType[];
    return chats[chats.length - 1];
}, [data.chatIds]);
const userEmail = useMemo(() => {
  return session.data?.user?.email || null;
}, [session.data?.user?.email]);
  const hasSeen = useMemo(()=>{
    if(!lastChat){
      return false
    }
    const seenArray = lastChat.seen || [];
    if(!userEmail){
      return false;
    }
    return seenArray.filter((user)=> user.email===userEmail).length ===0;
  },[userEmail,lastChat]);
  
  return ( 
    <>
    {/* {
      isLoading && 
      <LoadingModal/>
    } */}
    <div
      onClick={handleClick}
      className={`
        w-full 
        flex 
        items-center 
        space-x-3 
        p-3 
        hover:bg-neutral-100
        rounded-lg
        transition
        cursor-pointer
        ${selected ? ' bg-neutral-300' : 'bg-white'}`
      }
    >
      {
        data.isGroup?(
          <AvatarGroup users={data.users}/>
        ):
        (
          <Avatar user={otherUser} />
        )
      }
     <div className="min-w-0 flex-1">
      <div className="focus:outline-none">
        <div className="
          flex justify-between items-center mb-1
        ">
          <p
            className="text-md font-medium text-gray-900"
          >
            {data.name || otherUser.name}
          </p>
         
        </div>
        
      </div>
     </div>
    </div>
    </>
   );
}
 
export default UserBox;