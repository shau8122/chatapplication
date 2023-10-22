'use client'
import {  useState } from "react";
import { useSession } from "next-auth/react";
import { FaUsers } from 'react-icons/fa';
import { FaComments } from 'react-icons/fa';
import { usePathname, useRouter } from "next/navigation";
import Avatar from "./Avatar";
import ProfileEditModal from "./ProfileEditModal";
const Navbar = () => {
  const session = useSession();
  const router = useRouter();
  const [isOpen,setIsOpen]=useState(false);
  const pathname = usePathname();
  const handleClick=()=>{
    router.push('/users')
  }
  const handleClick2=()=>{
    router.push('/messages')
  }
  const handleSignOut = () => {
    setIsOpen(true);
}
  return ( 
    <>
    <ProfileEditModal 
    isOpen={isOpen}
    onClose={()=>setIsOpen(false)}
    currentUser={session.data?.user as any}
    />
    <nav className="flex items-center justify-between bg-white p-2 rounded-md  w-full h-16">
      <div className="flex justify-center items-center gap-4">
        <button onClick={handleClick} className='text-lg font-semibold ml-4'>
          <FaUsers size={32} className={`${pathname==='/users'? 'text-blue-600':"text-blue-400"} `} />
        </button>
        <button onClick={handleClick2} className={ `text-lg font-semibold ml-4`}>
          <FaComments size={32} className={`${pathname==='/messages'? 'text-blue-600':"text-blue-400"} `}/>
        </button>
      </div>
      <div className="flex justify-center items-center ">
        <h1 className="text-3xl font-mono font-bold text-blue-900">ChatApp</h1>
      </div>
      <button onClick={handleSignOut}>
        <Avatar user={session.data?.user as any}/>
      </button>
    </nav>
    </>
   );
}
 
export default Navbar;