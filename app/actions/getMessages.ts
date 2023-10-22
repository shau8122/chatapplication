import prismadb from '@/libs/prismadb'
import getCurrentUser from './getCurrentUser'

const getMessages =async ()=>{
  const currentUser=  await getCurrentUser();
  if(!currentUser?.id){
    return [];
  }
  try {
    const conversations = await prismadb.message.findMany({
      orderBy:{
        lastMessageAt:'desc'
      },
      where:{
        userIds:{
          has:currentUser.id
        }
      },
      include:{
        users:true,
        chats:{
          include:{
            sender:true,
            seen:true
          }
        }
      }
    })
    return conversations;
  } catch (error:any) {
    return [];
  }
}
export default getMessages