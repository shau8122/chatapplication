import { User } from "next-auth";
import getAllUsers from "../actions/getAllUsers";
import Navbar from "@/components/Navbar";
import SideChat from "./components/SideChat";

export default async function UsersLayout({
  children
}:{children:React.ReactNode}){

  const Users =await getAllUsers();
  return(
      <div className="h-screen w-screen px-3 flex flex-col ">
        <Navbar />
        <div className="w-full h-[90%] flex flex-1 ">
      <div className="h-full w-[400px] shadow-lg">
        {
          Users  && <SideChat users={Users}  />
        }
      </div>
      <div className="h-full flex-1 hidden lg:block">
       {children}
      </div>
    </div>
       
      </div>
  )
}