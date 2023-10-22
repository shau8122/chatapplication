import prismadb from '@/libs/prismadb'

const getChats = async (
  messageId:string
)=>{
  try {
    const chats = await prismadb.chat.findMany({
      where:{
        messageId:messageId
      },
      include:{
        sender:true,
        seen:true,
      },
      orderBy:{
        createdAt:'asc'
      }
    })
    return chats
  } catch (error:any) {
    return []
  }
}
export default getChats;