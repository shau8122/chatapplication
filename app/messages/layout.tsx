

import Navbar from "@/components/Navbar";

export default async function UsersLayout({
  children
}:{children:React.ReactNode}){

  return(
      <div className="h-screen w-screen px-3 flex flex-col ">
        <Navbar />
       {children}
       
      </div>
  )
}