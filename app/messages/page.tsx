import EmptyChatBox from "@/components/EmptyChatBox";
import SideMessageBox from "./components/SideMessageBox";
import getAllUsers from "../actions/getAllUsers";
import getMessages from "../actions/getMessages";
import { FullMessageType } from "../types";
const User = async() => {
   const messages= await getMessages();
  
  const Users =await getAllUsers();
  return (
    <div className="w-full h-[90%] flex flex-1 ">
      <div className="h-full w-[400px] ">
        {Users && messages && (
          <SideMessageBox
            users={Users}
            initialMessages={messages as unknown as FullMessageType[]}
          />
        )}
      </div>
      <div className="h-full flex-1 hidden lg:block"><EmptyChatBox/></div>
    </div>
  );
};

export default User;
