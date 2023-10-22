import prismadb from '@/libs/prismadb'
import getCurrentUser from './getCurrentUser'

const getMessagesById= async(
  messageId: string
)=>{
  try {
    const currentUser = await getCurrentUser();
    if(!currentUser?.email){
      return null
    }
    const message = await prismadb.message.findUnique({
      where:{
        id: messageId
      },
      include:{
        users:true
      }
    })
    return message
  } catch (error:any) {
    return null
  }
}
export default getMessagesById;