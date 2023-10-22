
import getUserSession from "./getUserSession";
import prismadb from "@/libs/prismadb";
const getAllUsers=async ()=>{
  const session = await getUserSession();
  if(!session?.user?.email){
    return null;
  }
  try {
    const allUsers = await prismadb.user.findMany({
      orderBy:{
        createdAt: 'desc',
      },
      where:{
        NOT:{
          email:session.user.email
        }
      }
    })
    if(!allUsers){
      return null;
    }
    return allUsers;
  } catch (error:any) {
    return null;
  }
}
export default getAllUsers;