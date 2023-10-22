
// import getConversationById from "@/app/actions/getConversationById"
// import getMessages from "@/app/actions/getMessages";
// import EmptyState from "@/app/components/EmptyState";
// import Header from "./components/Header";
// import Body from "./components/Body";
// import Form from "./components/Form";

import getChats from "@/app/actions/getChats";
import getMessagesById from "@/app/actions/getMessagesById";
import EmptyChatBox from "@/components/EmptyChatBox";
import ChatNavbar from "./ChatNavbar";
import ChatInput from "./ChatInput";
import ChatBody from "./ChatBody";
import getMessages from "@/app/actions/getMessages";
import getAllUsers from "@/app/actions/getAllUsers";
import SideMessageBox from "../components/SideMessageBox";
import { FullMessageType } from "@/app/types";

interface IParams{
  messageId: string
};

const MessageId = async ({params}:{params:IParams})=>{
  const messages= await getMessages();
  
  const Users =await getAllUsers();
  const message = await getMessagesById(params.messageId);
  const chats = await getChats(params.messageId)
  console.log(message)
  if(!message){
    return(
      <div className="w-full h-[90%] flex flex-1 ">
      <div className="h-full w-[400px] ">
        {Users && messages && (
          <SideMessageBox
            users={Users}
            initialMessages={messages as unknown as FullMessageType[]}
          />
        )}
      </div>
      <div className="h-full flex-1 "><EmptyChatBox/></div>
    </div>
    )
  }
  return (
    <div className="w-full h-[90%] flex flex-1 ">
      <div className="h-full w-[400px] hidden lg:block">
        {Users && messages && (
          <SideMessageBox
            users={Users}
            initialMessages={messages as unknown as FullMessageType[]}
          />
        )}
      </div>
      <div className="h-full flex-1 ">
      <div className="h-full flex flex-col shadow-md">
        <ChatNavbar message={message} />
        <ChatBody initialChat={chats}/>
        <ChatInput/>
      </div>
      </div>
    </div>
      
  )
}
export default MessageId