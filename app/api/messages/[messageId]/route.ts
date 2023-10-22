import getCurrentUser from '@/app/actions/getCurrentUser';
import {NextResponse} from 'next/server'
import prismadb from '@/libs/prismadb'
import { pusherServer } from '@/libs/pusher';


interface IParams{
  messageId?:string
}

export async function DELETE(
  request:Request,
  {params}:{params:IParams}
){
  try {
    const {messageId}=params;
    const currentUser = await getCurrentUser();
    if(!currentUser?.id){
      return new NextResponse('Unauthorized',{status:401});
    }
    const existingMessage = await prismadb?.message.findUnique({
      where:{
        id:messageId
      },
      include:{
        users:true
      }
    })
    if(!existingMessage){
      return  new NextResponse('Invalid Id',{ status :400})
    }
    const deletedConversation = await prismadb.message.deleteMany({
      where:{
        id:messageId,
        userIds:{
          hasSome:[currentUser.id]
        }
      }
    })
    existingMessage.users.forEach((user)=>{
      if(user.email){
        pusherServer.trigger(user.email,'message:remove',existingMessage)
      }
    })
    return NextResponse.json(deletedConversation )
  } catch (error:any) {
    console.log(error,'ERROR_CONVERSATION_DELETE');
    return new NextResponse('Internal Error',{status:500})
  }
}